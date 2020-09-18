
const crypto = require('crypto');
const {validationResult} = require('express-validator');

const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { sendWelcomeEmail, sendCancelEmail, sendResetPasswordEmail } = require('../utils/sendEmail');

const sharp = require('sharp');
const multer = require('multer');

// disk storage ukoliko fajl direktno snimamo u public folder
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/public/img/users");
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];

        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
});

// filtriranje input fajla
const multerFilter = (req, file, cb) => {
    if (!file.originalname.toLowerCase().match(/\.(png|jpg|jpeg|bmp)$/)) {
        return cb(
            new ErrorResponse(
                "Izabrani fajl nije slika, ponovite unos i izaberite sliku",
                400
            ),
            false
        );
    }
    // ovo je default ako je validacija true
    cb(null, true);
};

const upload = multer({
    // kada je ovo podeseno ONDA SE NE VIDI FAJL u req.file i plus posto se ceo kod aploaduje na heroku, AWS, prilikom svakog pokretanja app ceo file sistem SE BRISE zato moraju slike da se sacuvaju u db    
    //dest: 'avatar/'
    limits: {
        fileSize: 10*1024*1024
    },
    storage: multerStorage,
    fileFilter: multerFilter
});

// middleware za upload avatar slike
exports.uploadUserPhoto = upload.single('avatar');


// @desc   Register User
// @route  POST /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
    
    const {name, email, password, confirmPassword} = req.body;

    const  errors = validationResult(req);
    const errorsString = errors.array().reduce((acc, val) => {
        acc += `${val.msg}; `;
        return acc
    }, '');
        
    // validacija preko express-validatora
    if (!errors.isEmpty()) {
        return res.status(401).json({
            success: false,
            error: errorsString
        })
    }

    const emailExist = await User.findOne({email});

    if (emailExist) {
        //req.flash('error', 'Korisnik sa unetim e-mailom postoji')
        // return res.redirect('/api/v1/auth/register');
        return res.status(422).json({
            success: false,
            data: 'Korisnik sa unetim e-mailom postoji'
        });
    }

    const user = await User.create({
        name,
        email,
        password  
    });

    // slanje welcome emaila nakon uspesnog snimanja 
    sendWelcomeEmail(user.name, user.email);

    // umesto ovoga ispod stavlja se response koji u sebi ukljucuju cookie
    await sendTokenResponse(user, 200, res, req);
    
});
    
    
// @desc   Login User
// @route  POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
    
    // ako se podaci salju kao json, bodyparser ih ubacuje u req.body
    var {email, password} = req.body;

    // formidable pored podataka iz formData moze da prihvata i json , u tom slucaju ne treba bodyparser
    // ubacuje ih u body.fields
    //const {email, password} = req.fields;
    
    // validacija da li su polja prazna
    if (!email || !password) {

        return next(new ErrorResponse('Unesite email i šifru', 400));        
    }
    // u User modelu select: false znaci da nam ne vraca sifru, ali ovde nam je potrebna da bi mogli da uporedimo sifre i dodajemo select(+password)
    const user = await User.findOne({email}).select('+password');

    if (!user) {

         return next(new ErrorResponse('Pogrešno uneti podaci. Invalid credentials.', 401));        
    }

    // pozivanje methods iz User modela za proveru sifre
    const isMatch = await user.passwordMatchCheck(password);

    if (!isMatch) {

        return next(new ErrorResponse('Pogrešno uneti podaci. Invalid credentials.', 401));       
    };
    
    
    // umesto ovoga ispod stavlja se response koji u sebi ukljucuju cookie
    await sendTokenResponse(user, 200, res, req);

}); 


// @desc   Get loged user
// @route  GET /api/v1/auth/me
// @access Private

exports.getMe = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id).populate({
        path: 'products',
        select:'proizvod sifra'
    });
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update loged user info 
// @route   PUT /api/v1/auth/updateDetails
// @access  Private

exports.updateDetails = asyncHandler(async (req, res, next) => {
    const { name, email } = req.body;
    
    const user = await User.findByIdAndUpdate(req.user.id, {name, email}, {
        new: true,
        runValidators: true
    });  
    
    res.status(200).json({
        success: true,
        data: user
    });    
    
}); 

// @desc    Update loged user password 
// @route   PUT /api/v1/auth/updatePassword
// @access  Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
        
    const user = await User.findById(req.user.id).select('+password');

    // pozivamo methods iz User modela
    if (!(await user.passwordMatchCheck(req.body.currentPassword))) {
        return next(new ErrorResponse('Postojeca sifra neispravna', 401));
    }

    user.password = req.body.newPassword;
    // snimamo sa validateBeforeSave: true

    // izbrisi postojeci token iz tokens array
    user.tokens = user.tokens.filter(token => token.token !== req.session.token);

    await user.save();
    // prilikom promene ili resetovanja sifre VRACA SE TOKEN - pravilo
    // jer je sada korisnik sa drugom sifrom
    await sendTokenResponse(user, 200, res, req);        
}); 

// @desc    Forgotten password link
// @route   POST /api/v1/auth/resetpassword
// @access  Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // nadji korisnika preko unetog emaila
    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return next(new ErrorResponse('Ne postoji korisnik sa tom e-mail adresom!', 404));
    }
    //generisi reset token i dodavanje useru token / vreme isteka
    const resetToken = user.getResetPasswordToken();

    // snimanje hashovanog tokena i vremena isteka
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    //slanje emaila sa linkom za reset
    try {
        await sendResetPasswordEmail(
            user.name, 
            user.email, 
            resetUrl);

            console.log(`Uspešno poslata poruka na adresu ${user.email}`.green);

            res.status(200).json({
                success: true,
                data: 'Email sent'
            });
        
    } catch (error) {
        console.log(`Poruka nije poslata na adresu ${user.email}. Error message: ${error}`.red);
        // resetuj reset polja i snimi ih
        user.resetPasswordToken = void 0;
        user.resetPasswordExpire = void 0;
        await user.save();

        return next(new ErrorResponse('Došlo je do greške, poruka nije poslata'), 500);
    }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()} 
    });

    if (!user) {
        return next(new ErrorResponse('Neispravan token', 400));
    }
    // da bi ovo radilo ovako MORA da se UPOTREBI findOne jer find vraca Array 
    user.password = req.body.password;
    user.resetPasswordToken = void 0;
    user.resetPasswordExpire = void 0;

    await user.save();

    await sendTokenResponse(user, 200, res, req);

});

// @desc    Create / Update user avatar
// @route   POST /api/v1/auth/me/avatar
// @access  Private

exports.updateAvatar = asyncHandler(async (req, res, next) => {
    // samo ako u multer.options nemamo dest onda ovde preko req.file mozemo da mu pristupimo
    if (!req.file) {
        return next(new ErrorResponse('Niste izabrali avatar sliku', 400));
    }
    
    //req.user.avatar = req.file.buffer;
    // dodavanje sharp modula za narmalizaciju slike resize / png i vracanje u buffer format zbog snimanja u db
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();

    //const user = await req.user.save();
    const user = await User.findByIdAndUpdate(req.user.id, {avatar: buffer}, {
        new: true
    });

    res.status(200).json({
        success: true,
        data: user
    });    
    
}); 

// @desc    Get user avatar
// @route   GET /api/v1/users/me/avatar
// @access  Private

exports.getAvatar = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+avatar');

    if (!user) {
        return next(new ErrorResponse(`Korisnik sa trazenim id ${req.user.id} ne postoji`, 400));
    }

    if (!user.avatar) {
        return next(new ErrorResponse(`Korisnik sa trazenim id ${req.user.id} nema avatar sliku`, 400));
    }
    // nije bitna originalna extenzija slike bmp/jpg/jpeg/png
    // u svakom slučaju preko sharp modula postavili smo da slika uvek bude png
    res.set('Content-Type', 'image/png');
 
    res.status(200).send(user.avatar);         
 }); 

// @desc    Delete user avatar
// @route   DELETE /api/v1/auth/me/avatar
// @access  Private

exports.deleteAvatar = asyncHandler(async (req, res, next) => {
        
   req.user.avatar = void 0;

    //const user = await req.user.save();
    const user = await User.findByIdAndUpdate(req.user.id, {avatar: req.user.avatar}, {
        new: true
    });

    res.status(200).json({
        success: true,
        data: user
    });    
    
}); 

// @desc    Log user out & clear cookie 
// @route   POST /api/v1/auth/logout
// @access  Private

exports.logout = asyncHandler(async (req, res, next) => {

    // brisanje tokena iz kog hocemo da se izlogujemo, ostali ostaju
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.cookies.token ); 

    await req.user.save();

    // postavljanje cookija na vrednost none
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
            success: true,
            data: "Korisnik je uspešno izlogovan"
        });
        
    }); 

// @desc    Log user out & clear cookie 
// @route   POST /api/v1/auth/logoutAll
// @access  Private

exports.logoutAll = asyncHandler(async (req, res, next) => {
    
    // brisanje svih tokena tj brisanje svih sessions, izlogujemo se iz svih uređaja
    req.user.tokens = [];
    await req.user.save();

    // postavljanje cookija na vrednost none
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    
    res.status(200).json({
        success: true,
        data: "Izlogovani ste sa svih uređaja"
    });
    
});

// @desc    Delete Logged user 
// @route   DELETE /api/v1/auth/me
// @access  Private

exports.deleteMe = asyncHandler(async (req, res, next) => {
    
    await User.findByIdAndDelete(req.user.id);

    //postavljanje cookija na vrednost none
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    // slanje emaila sa potvrdom brisanja svog accounta
    sendCancelEmail(req.user.name, req.user.email);

    res.status(200).json({
        success: true,
        data: 'User deleted'
    });

}); 

// kreiranje tokena, cookie i generisanje responsa
// tokenu na FE se može pristupiti preko local Storage ili preko cookie što je sigurnije 
const sendTokenResponse = async (user, statusCode, res, req) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        // cookie moze da procita samo http scripta na FE
        httpOnly: true,
        // domain: 'localhost',
        path: '/'
    };

    // kada se app pokreće u production modu pošalji cookie preko https, u tom slučaju postavi Security flag na true    
    if (process.env.NODE_ENV === "production") {
        // ovim se to postize
        options.secure = true;
    }

    // ubačeno snimanje tokena u model tj bazu kako bi se moglo napraviti "pravo" logovanje sa vise uređaja i odjavljivanje sa pojedinih dok ostali ostaju ulogovani
    // isto generisani token ostaje i dalje validan i nakon odjavljivanja pa to neko moze da zloupotrebi, ovim se to izbegava
    user.tokens = user.tokens.concat({token});
    await user.save();
    
    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        token
    })
};
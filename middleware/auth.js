const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');
const errorResponse = require('../utils/errorResponse');

// prilikom kreiranja novog proizvoda potrebno je da user bude logovan tako da ova middleware fja najpre preuzima token iz requesta, dekodira id i proverava usera
// token moze biti smesten na dva mesta ili u cookie ili u headers.authorization (string pocinje sa Bearer pa razmak pa token) 
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    
    // ako token ne postoji znaci da korisnik nije logovan
    if (!token) {
        return next(new errorResponse('Korisnik nema autorizaciju da pristupi ovoj ruti.', 401));
    }

    try {
        // verifikacija tokena tj token se razlaze na JWT payload (id, issuedAt/iat, exp)
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        // veoma prakticno da se ovako izvede jer nadalje request sadrzi usera
        req.user = await User.findById(decode.id);
        next();
    } catch (err) {
            return next(new errorResponse('Korisnik nema autorizaciju da pristupi ovoj ruti', 401));
    }
});

// odobri pristup samo određenim user roles
exports.authorize = (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return next(new errorResponse(`Korisnik sa role: ${req.user.role} ne može da pristupi ovoj ruti`, 403));
            }
            next();
    }
};
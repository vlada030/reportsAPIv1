const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const { validationResult } = require('express-validator');

// @desc   Get all products
// @route  GET /api/v1/products
// @access Private

// exports.getProducts = async (req, res, next) => {
//     try {
//         const products = await Product.find();

//         // poziva fju za pretvaranje Decimal128 u String
//         const newProducts = decimal128ToStringOutput(products);
        
//         res.status(200).json({
//             success: true,
//             count: newProducts.length,
//             data: newProducts
//         }); 
//     } catch (err) {
//         next(err);
//     }  
// };

// umesto try/catch koristimo wrapper fju asyncHandler 
exports.getProducts = asyncHandler(async (req, res, next) => {
    
    // poziva fju za pretvaranje Decimal128 u String jer smo u routes pre ove fje
    // pozvali middleware advancedResults
    //res.advancedResults.data = decimal128ToStringOutput(res.advancedResults.data);
    
    res.status(200).json(res.advancedResults);    
    // res.status(200).json({
    //     success: true,
    //     count: newProducts.length,
    //     pagination,
    //     data: newProducts
    // });    
});

// @desc   Get single product
// @route  GET /api/v1/products/:id
// @access Private

exports.getProduct = asyncHandler(async (req, res, next) => {
    
    const product = await Product.find({sifra: req.params.id})
        .populate({
            path: 'createdByUser',
            select: 'name email'
        }).populate({
            path: 'modifiedByUser',
            select: 'name email'
        });
        
    if (product.length !== 1) {
        return next(new ErrorResponse(`Proizvod sa šifrom ${req.params.id} nije pronađen`, 404)); 
    }    
    
    // poziva fju za pretvaranje Decimal128 u String
    const convertedProduct = decimal128ToStringOutput(product);
    
    res.status(200).json( {
        success: true,
        data: convertedProduct
    }); 
});


// @desc   Create product
// @route  POST /api/v1/products
// @access Private

exports.createProduct = asyncHandler( async (req, res, next) => {
    
    req.body.createdByUser = req.user.id;
    
    // cupanje errors iz express-validatora
    const  errors = validationResult(req);

    const errorsString = errors.array().reduce((acc, val) => {
        acc += `${val.msg}; `;
        return acc
    }, '');
        
    // validacija preko express-validatora
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errorsString
        })
    }

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    });
}); 

// @desc   Update product
// @route  PUT /api/v1/products/:id
// @access Private

exports.updateProduct = asyncHandler(async (req, res, next) => {    
    let product = await Product.findOne({sifra: req.params.id});

    // u slucaju da u ObjectId promenimo jedno slovo, a ukupan broj/format
    // id ostane isti izbacuje success: true, DATA: NULL
    // vazi i za ObjectId i za npr {sifra: 777}
    if (!product) {
        return next(new ErrorResponse(`Proizvod sa šifrom ${req.params.id} nije pronađen`, 404));
    }

    // cupanje errors iz express-validatora
    const errors = validationResult(req);

    const errorsString = errors.array().reduce((acc, val) => {
        acc += `${val.msg}; `;
        return acc
    }, '');
        
    // validacija preko express-validatora
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errorsString
        })
    }
    // dodavanje usera iz middleware tokena koji je modifikovao proizvod
    req.body.modifiedByUser = req.user.id;
    // req.body.modifiedAt = Date.now();
    //req.fields.modifiedByUser = req.user.id;
    //req.fields.modifiedAt = Date.now();

    product = await Product.findOneAndUpdate({sifra: req.params.id}, req.body, {
        new: true,
        // ako ne postoji sifra ovim ce da je kreira
        //     upsert: true
        // vrsi update samo elemenata koji postoje u req.body
        //     overwrite: true

        // Pokrece mongoose validaciju
        //     runValidators: true,
        //     context: 'query'
        
    });

    //product = decimal128ToStringOutput(product);
    //console.log(product);
    res.status(200).json({
        success: true,
        data: product
    })     
});

// @desc   Delete product
// @route  DELETE /api/v1/products/:id
// @access Private

exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findOne({sifra: req.params.id});

    if (!product) {
        return next(new ErrorResponse(`Proizvod sa šifrom ${req.params.id} nije pronađen`, 404));
    }

    await Product.deleteOne({sifra: req.params.id});

    res.status(200).json({
        success: true,
        data: 'Proizvod je uspešno obrisan'
    });   
    
});

// helper fja za prebacivanje Decimal128 u String

const decimal128ToStringOutput = (arrOfProductProperties) => {
    return arrOfProductProperties.map( product => {
        try {
            let precnikZice = void 0;
            let otpor = void 0;
            let debIzolacije = void 0;
            let debPlasta = void 0;
            let spPrecnik = void 0;
            let createdAt = void 0;
            let updatedAt = void 0;

            if (product.precnikZice) {
                precnikZice =  product.precnikZice.toString();
            } 

            if (product.otpor) {
                otpor =  product.otpor.toString();
            } 
            if (product.debIzolacije) {
                debIzolacije =  product.debIzolacije.toString();
            } 
            if (product.debPlasta) {
                debPlasta =  product.debPlasta.toString();
            } 
            if (product.spPrecnik) {
                spPrecnik =  product.spPrecnik.toString();
            } 
            if (product.createdAt) {
                createdAt =  product.createdAt.toUTCString();
            } 
            if (product.updatedAt) {
                updatedAt =  product.updatedAt.toUTCString();
            } 
            if (product.boja) {
                boja =  product.boja.toLowerCase();
            } 

            return {
                _id: product._id,
                sifra: product.sifra,
                debPPS1: product.debPPS1,
                debPPS2: product.debPPS2,
                parcijalna: product.parcijalna,
                proizvod: product.proizvod,
                napon: product.napon,
                boja,
                propis: product.propis,
                brojZica: product.brojZica,
                precnikZice: precnikZice,
                otpor: otpor,
                debIzolacije: debIzolacije,
                debPlasta: debPlasta,
                spPrecnik: spPrecnik,
                ispitniNapon: product.ispitniNapon,
                createdAt,
                updatedAt,
                createdByUser: product.createdByUser,
                modifiedByUser: product.modifiedByUser
            };

        } catch (error) {
            throw new ErrorResponse('Greska u konverziji, funkcija decimal128ToStringOutput(), product controller', 500);
        }        
        
    });
};
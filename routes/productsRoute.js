const express = require('express');
const { body } = require('express-validator');

const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/productsController');
const advancedResults = require('../middleware/advancedResults');
const Product = require('../models/Product');

// dodavanje middleware fja
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(advancedResults(Product), getProducts)
    .post(
        protect,
        [
            body("sifra")
                .isNumeric()
                .isLength({ min: 7, max: 7 })
                .withMessage('Šifra proizvoda mora da sadrži 7 broja')
                .custom(async (value) => {
                    const product = await Product.findOne({ sifra: value });

                    if (product) {
                        throw new Error(
                            "Proizvod sa ovom šifrom postoji, unesite drugu šifru"
                        );
                    }
                    return true;
                })
                .trim(),
            body("proizvod", 'Naziv proizvoda sadrži od 2 do 45 slova/broja')
                .isLength({ min: 2, max: 45 })
                .trim(),
            body("propis", 'Naziv standarda sadrži najviše 40 slova/broja')
                .isLength({ min: 1, max: 40 })
                .trim(),
            body("brojZica", 'Broj žica provodnika je u intervalu 1 - 2500')
                .isInt({ min: 1, max: 2500 })
                .trim(),
            body("precnikZice", 'Prečnik žice komponente je u intervalu 0.2 - 3.6')
                .isFloat({ min: 0.2, max: 3.6 })
                .trim(),
            body("otpor", 'Vrednost otpora mora da bude u granicama 0.01 - 24')
                .isFloat({ min: 0.01, max: 24 })
                .trim(),
            body("debIzolacije", 'Debljina izolacije je u intervalu 0.1 - 9')
                .isFloat({ min: 0.1, max: 9 })
                .trim(),
            body("debPlasta", 'Debljina plašta je u intervalu 0.1 - 4')
                .isFloat({ min: 0.1, max: 4 })
                .trim(),
            body("spPrecnik", 'Spoljnji prečnik mora da bude u granicama 2 - 70')
                .isFloat({ min: 2, max: 70 })
                .trim(),
        ],
        createProduct
    );
router
    .route("/:id")
    .get(protect, getProduct)
    .patch(
        protect,
        [
            body("proizvod", "Naziv proizvoda sadrži od 2 do 45 slova/broja")
                .isLength({ min: 2, max: 45 })
                .trim(),
            body("propis", "Naziv standarda sadrži najviše 40 slova / broja")
                .isLength({ min: 1, max: 40 })
                .trim(),
            body("brojZica", "Broj žica provodnika je u intervalu 1 - 2500")
                .isInt({ min: 1, max: 2500 })
                .trim(),
            body(
                "precnikZice",
                "Prečnik žice komponente je u intervalu 0.2 - 3.6"
            )
                .isFloat({ min: 0.2, max: 3.6 })
                .trim(),
            body("otpor", "Vrednost otpora mora da bude u granicama 0.01 - 24")
                .isFloat({ min: 0.01, max: 24 })
                .trim(),
            body("debIzolacije", "Debljina izolacije je u intervalu 0.1 - 9")
                .isFloat({ min: 0.1, max: 9 })
                .trim(),
            body("debPlasta", "Debljina plašta je u intervalu 0.1 - 4")
                .isFloat({ min: 0.1, max: 4 })
                .trim(),
            body(
                "spPrecnik",
                "Spoljnji prečnik mora da bude u granicama 2 - 70"
            )
                .isFloat({ min: 2, max: 70 })
                .trim(),
        ],
        updateProduct
    )
    .delete(protect, deleteProduct);

module.exports = router;
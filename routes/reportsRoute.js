const express = require('express');

const {body} = require('express-validator'); 

const { getAllDomReports, getDomReport, createDomReport,updateDomReport, deleteDomReport} = require('../controllers/domReportsController');

const { getExpReport, createExpReport, getAllExpReports, updateExpReport, deleteExpReport } = require('../controllers/expReportsController');

const {getAllShiftReports, getShiftReport, createShiftReport,  updateShiftReport, deleteShiftReport} = require('../controllers/shiftReportsController');

const {protect} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const ExpReport = require('../models/ExpReport');
const DomReport = require('../models/DomReport');
const ShiftReport = require('../models/ShiftReport');

const router = express.Router();

// DOM REPORTS
router
    .route("/dom")
    .get(protect, advancedResults(DomReport, {path: 'createdByUser', select: 'name'}), getAllDomReports)
    .post(
        protect,
        [
            body("sifra", "Šifra se sastoji od 7 cifara")
                .isNumeric()
                .isLength({min: 7, max: 7})
                .trim(),
            body("radniNalog", "Radni nalog sastoji se od 8 cifara")
                .isNumeric()
                .isLength({min: 8, max: 8})
                .trim(),
            body("MISBroj")
                .isNumeric()
                .isLength({min: 7, max: 7})
                .withMessage("MIS broj sastoji se od 7 cifara")
                .bail()
                .custom(async (value) => {
                    const report = await DomReport.findOne({ MISBroj: value });

                    if (report) {
                        throw new Error("Izveštaj pod ovim MIS brojem postoji!");
                    }
                    return true;
                })
                .trim(),
            body("duzina", "Najmanja dužina je 1m, a najveća 3000m")
                .isNumeric()
                .isInt({ gt: 0, lt: 3000 })
                .trim(),
            body("velDob", "String ne duzi od 7 karaktera")
                .not()
                .isEmpty()
                .isLength({max: 7})
                .trim(),
            body("neto", "Najmanja težina je 1kg, a najveća 5000kg")
                .isNumeric()
                .isInt({ gt: 1, lt: 5000 })
                .trim(),
            body("bruto")
                .isNumeric()
                .isInt({ gt: 1, lt: 6000 })
                .withMessage('Najmanja težina je 1kg, a najveća 6000kg')
                .custom((value, {req}) => {
                    if (parseInt(req.body.neto, 10) > parseInt(value, 10) ) {
                        throw new Error("Bruto težina mora da bude veća od neto težine");
                    }
                    return true;
                })
                .trim()],
        createDomReport
    );

router
    .route("/dom/:id")
    .get(protect, getDomReport)
    .delete(protect, deleteDomReport)
    .put(
        protect,
        [
            body("sifra", "Šifra se sastoji od 7 cifara")
                .optional()
                .isNumeric()
                .isLength({ min: 7, max: 7 })
                .trim(),
            body("radniNalog", "Radni nalog sastoji se od 8 cifara")
                .optional()
                .isNumeric()
                .isLength({ min: 8, max: 8 })
                .trim(),
            body("duzina", "Najmanja dužina je 1m, a najveća 3000m")
                .optional()
                .isNumeric()
                .isInt({ gt: 0, lt: 3000 })
                .trim(),
            body("velDob", "String ne duzi od 7 karaktera")
                .optional()
                .not()
                .isEmpty()
                .isLength({max: 7})
                .trim(),
            body("neto", "Najmanja težina je 1kg, a najveća 5000kg")
                .optional()
                .isNumeric()
                .isInt({ gt: 1, lt: 5000 })
                .trim(),
            body("bruto")
                .optional()
                .isNumeric()
                .isInt({ gt: 1, lt: 6000 })
                .withMessage("Najmanja težina je 1kg, a najveća 6000kg")
                .bail()
                .custom(async(value, { req }) => {

                    let neto = parseInt(req.body.neto, 10);

                    if (!req.body.neto) {
                        const report = await DomReport.findOne({MISBroj: req.params.id});
                        
                        neto = report.neto;
                    }

                    if ( neto > parseInt(value, 10)) {
                        throw new Error(
                            "Bruto težina mora da bude veća od neto težine"
                        );
                    }
                    return true;
                })
                .trim(),
        ],
        updateDomReport
    );

// EXP REPORTS

router
    .route("/exp")
    .get(protect, advancedResults(ExpReport, {path: 'createdByUser', select: 'name'}),  getAllExpReports)
    .post(
        protect,
        [
            body("sifra", "Šifra se sastoji od 7 cifara")
                .isNumeric()
                .bail()
                .isLength({ min: 7, max: 7 })
                .trim(),
            body("godina", "Godina sadrži 4 cifre")
                .isNumeric()
                .bail()
                .isLength({ min: 4, max: 4 })
                .trim(),
            // body("dobos_1", "Broj na stranici ili MIS Broj doboša može imati 7 - 10 karaktera")
            //     .isLength({ min: 7, max: 11 })
            //     .trim()
            //     .escape(),
            // body("duzina_1", "Najmanja dužina je 1m, a najveća 15000m")
            //     .isNumeric()
            //     .isInt({ gt: 1, lt: 15000 })
            //     .trim()
            //     .escape(),

            // custom validator za sva polja dobos / duzina
            body().custom((value, {req}) => {
                for (const key in req.body) {
                    if (key.startsWith('dobos_')) {
                        if  (!(req.body[key].length >= 7 && req.body[key].length <= 10)) {
                            throw new Error("Broj na stranici ili MIS Broj doboša može imati 7 - 10 karaktera");
                        }
                        
                    } else if (key.startsWith('duzina_')) {
                        if  (!(req.body[key] >= 1 && req.body[key] <= 15000)) {
                            throw new Error("Najmanja dužina je 1m, a najveća 15000m");
                        }
                    }
                }
                return true;
            })
        ],
        createExpReport
    );

router
    .route("/exp/:id")
    .get(protect, getExpReport)
    .delete(protect, deleteExpReport)
    .put(
        protect,
        [
            body("sifra", "Šifra se sastoji od 7 cifara")
                .optional()
                .isNumeric()
                .bail()
                .isLength({ min: 7, max: 7 })
                .trim(),
            body("godina", "Godina sadrži 4 cifre")
                .optional()
                .isNumeric()
                .bail()
                .isLength({ min: 4, max: 4 })
                .trim(),
            // custom validator za sva polja dobos / duzina
            body().custom((value, { req }) => {
                for (const key in req.body) {
                    if (key.startsWith("dobos_")) {
                        if (
                            !(
                                req.body[key].length >= 7 &&
                                req.body[key].length <= 10
                            )
                        ) {
                            throw new Error(
                                "Broj na stranici ili MIS Broj doboša može imati 7 - 10 karaktera"
                            );
                        }
                    } else if (key.startsWith("duzina_")) {
                        if (!(req.body[key] >= 1 && req.body[key] <= 15000)) {
                            throw new Error(
                                "Najmanja dužina je 1m, a najveća 15000m"
                            );
                        }
                    }
                }
                return true;
            }),
        ],
        updateExpReport
    );

// SHIFT REPORTS
router
    .route("/shift")
    .get(protect, advancedResults(ShiftReport, {path: 'createdByUser', select: 'name'}), getAllShiftReports)
    .post(
        protect,
        body().custom((value, { req }) => {
            for (const key in req.body) {
                if (key.startsWith("radnik1_0") || key.endsWith("vreme")) {
                    if (!(req.body[key] >= 1 && req.body[key] <= 12)) {
                        throw new Error(
                            "Vreme radnika provedeno na radu je između 1 - 12 sati"
                        );
                    }
                } else if (key.endsWith('nap') || key.endsWith('proizvod')) {
                    if (req.body[key].length > 200) {
                        throw new Error(
                            "Polja napomene i naziv proizvoda mogu da sadrže najviše 200 karaktera"
                        );
                    }
                } else if (key.endsWith('duz') || key.endsWith('rn')) {
                    if (req.body[key].toString().length > 8) {
                        throw new Error(
                            "Polja radni nalog i dužina proizvoda mogu da sadrže najviše 8 cifre"
                        );
                    }
                } else if (
                    key.startsWith("pr") ||
                    key.startsWith("kor") ||
                    key.startsWith("pp") ||
                    key.startsWith("tel") ||
                    key.startsWith("pak") ||
                    key.startsWith("radnik1")
                ) {
                    if (req.body[key] > 250 || req.body[key] < 0) {
                        throw new Error(
                            "Unešeni brojevi ne smeju biti negativni i veći od 250"
                        );
                    }
                }  
        }
            return true;
        }), createShiftReport
    );

router
    .route("/shift/:id")
    .get(protect, getShiftReport)
    .put(
        protect,
        body().custom((value, { req }) => {
            for (const key in req.body) {
                if (key.startsWith("radnik1_0") || key.endsWith("vreme")) {
                    if (!(req.body[key] >= 1 && req.body[key] <= 12)) {
                        throw new Error(
                            "Vreme radnika provedeno na radu je između 1 - 12 sati"
                        );
                    }
                } else if (key.endsWith("nap") || key.endsWith("proizvod")) {
                    if (req.body[key].length > 200) {
                        throw new Error(
                            "Polja napomene i naziv proizvoda mogu da sadrže najviše 200 karaktera"
                        );
                    }
                } else if (key.endsWith("duz") || key.endsWith("rn")) {
                    if (req.body[key].toString().length > 8) {
                        throw new Error(
                            "Polja radni nalog i dužina proizvoda mogu da sadrže najviše 8 cifre"
                        );
                    }
                } else if (
                    key.startsWith("pr") ||
                    key.startsWith("kor") ||
                    key.startsWith("pp") ||
                    key.startsWith("tel") ||
                    key.startsWith("pak") ||
                    key.startsWith("radnik1")
                ) {
                    if (req.body[key] > 250 || req.body[key] < 0) {
                        throw new Error(
                            "Unešeni brojevi ne smeju biti negativni i veći od 250"
                        );
                    }
                }
            }
            return true;
        }),
        updateShiftReport
    )
    .delete(protect, deleteShiftReport);

module.exports = router;
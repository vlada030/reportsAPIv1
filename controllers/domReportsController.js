const DomReport = require("../models/DomReport");
const Product = require("../models/Product");

const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

const {validationResult} = require('express-validator');

// @desc   Get Report
// @route  GET /api/v2/reports/dom?id=MISBroj&lang=lang
// @access Private

exports.getDomReport = asyncHandler(async (req, res, next) => {
    const MISBroj = req.query.id
    const lang = req.query.lang || 'ser';

    // ako postoji MISBroj onda se ucitava postojeci izvestaj u suprotnom izvestaj treba da se kreira
    // isto se odnosi i na report
    let report = null;

    if (MISBroj) {
        report = await DomReport.findOne({ MISBroj })
            .populate({
                path: "createdByUser",
                select: "name",
            })
            .populate({
                path: "updatedByUser",
                select: "name",
            })
            .populate("proizvod"); // popunjava virtuals polje
    
        if (!report) {
            // return next(
            //     new ErrorResponse(
            //         `Izveštaj sa MIS brojem ${MISBroj} ne postoji`,
            //         400
            //     ));
            return res.status(404).render("domReports", {
                title: "Izveštaji za domaće tržište",
                path: "dom",
                lang,
                userName: req.session.name,
                readonlyInputStatus: false,
                errorMessage: 'Traženi izveštaj ne postoji ili je izbrisan.'
            });
        }
    }

    res.status(200).render('domReports', {
        title: "Izveštaji za domaće tržište",
        path: "dom",
        lang,
        userName: req.session.name,
        report,
        readonlyInputStatus: false   
    })
    
});

// OVO JE ZAMENJENO SA KODOM IZNAD

// @desc   Domestic Reports
// @route  GET /api/v2/reports/dom
// @access Private

// exports.getDomReportHTML = asyncHandler((req, res) => {
//     const lang = req.query.lang || 'ser';

//     res.status(200).render("domReports", {
//         title: "Izveštaji za domaće tržište",
//         path: "dom",
//         lang,
//         userName: req.session.name,
//         readonlyInputStatus: false        
//     });
// });

// @desc   Domestic Reports - All
// @route  GET /api/v2/reports/dom/allReports
// @access Private

exports.getAllDomReportsHTML = asyncHandler(async(req, res) => {
    const reports = await DomReport.find().populate("proizvod");

    res.status(200).render("domExpReportsAll", {
        title: "Izveštaji za domaće tržište",
        path: "dom",
        userName: req.session.name,
        reports
    });
});

// @desc   Create Report
// @route  POST /api/v2/reports/dom
// @access Private

exports.createDomReport = asyncHandler(async (req, res, next) => {
    const lang = req.query.lang || 'ser';
    req.body.createdByUser = req.user.id;

    // za povlacenje podataka na osnovu sifre prpoizvoda
    const proizvod = await Product.findOne({sifra: req.body.sifra});

    req.body.proizvod = proizvod;

    // cupanje errors iz express-validatora
    const errors = validationResult(req);
    //console.log(errors)
    
    // validacija preko express-validatora
    // implementirano pamcenje prethodnog unosa
    if (!errors.isEmpty()) {
        return res.status(422).render("domReports", {
            title: "Izveštaji za domaće tržište",
            path: "dom",
            lang,
            userName: req.session.name,
            errorMessage: errors.array()[0].msg,
            report: req.body,
            readonlyInputStatus: false
        })
    }
    await DomReport.create(req.body);

    // ovo mora da se doda da bi se zadrzao unos , da ne brise unesene vrednosti
    // const report = await DomReport.findOne({ MISBroj: req.body.MISBroj })
    //     .populate({
    //         path: "createdByUser",
    //         select: "name",
    //     })
    //     .populate({
    //         path: "updatedByUser",
    //         select: "name",
    //     })
    //     .populate("proizvod"); // popunjava virtuals polje

    res.status(201).render("domReports", {
        title: "Izveštaji za domaće tržište",
        path: "dom",
        lang,
        userName: req.session.name,
        successMessage: 'Izveštaj je uspešno snimljen u bazu.',
        report: req.body,
        readonlyInputStatus: false    
    });
});

// @desc   Get All Reports
// @route  GET /api/v2/reports/dom/all
// @access Private

exports.getAllDomReports = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc   Update Report
// @route  PUT /api/v2/reports/dom/:id
// @access Private

exports.updateDomReport = asyncHandler(async (req, res, next) => {
    let report = await DomReport.findOne({ MISBroj: req.params.id });

    if (!report) {
        return next(new ErrorResponse("Zahtevani izvestaj ne postoji", 400));
    }

    req.body.updatedByUser = req.user.id;

    report = await DomReport.findOneAndUpdate(
        { MISBroj: req.params.id },
        req.body,
        {
            runValidators: false,
            new: true,
        }
    );

    res.status(200).json({
        success: true,
        data: report,
    });
});

// @desc   Delete Report
// @route  DELETE /api/v2/reports/dom/:id
// @access Private

exports.deleteDomReport = asyncHandler(async (req, res, next) => {
    const lang = req.query.lang || 'ser';

    await DomReport.findOneAndDelete({ MISBroj: req.params.id });

    res.status(200).render("domReports", {
        title: "Izveštaji za domaće tržište",
        path: "dom",
        lang,
        userName: req.session.name,
        readonlyInputStatus: false,
        successMessage: 'Izveštaj je izbrisan'       
    });
    
});

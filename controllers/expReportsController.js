const ExpReport = require('../models/ExpReport');
const Product = require('../models/Product');

const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

const {validationResult} = require('express-validator');

// @desc   Get Report
// @route  GET /api/v2/reports/exp?id=id&lang=lang
// @access Private

exports.getExpReport = asyncHandler( async(req, res, next) => {
    const reportId = req.query.id;
    const lang = req.query.lang || "ser";

    // ako postoji id onda se ucitava postojeci izvestaj u suprotnom izvestaj treba da se kreira
    // isto se odnosi i na report
    let report = null;

    if (reportId) {
        report = await ExpReport.findById(reportId).populate({
                path: "createdByUser",
                select: "name",
            })
            .populate({
                path: "updatedByUser",
                select: "name",
            })
            .populate("proizvod");
    
        if (!report) {
            //return next(new ErrorResponse(`Izabrani izvestaj ne postoji`, 400));
            return res.status(404).render("expReports", {
                title: "Izveštaji za inostrano tržište",
                path: "exp",
                lang,
                userName: req.session.name,
                readonlyInputStatus: false,
                errorMessage: 'Traženi izveštaj ne postoji ili je izbrisan.'
            });
        }
    }


    res.status(200).render("expReports", {
        title: "Izveštaji za inostrano tržište",
        path: "exp",
        lang,
        userName: req.session.name,
        report,
        readonlyInputStatus: false,
    });
});

// @desc   Get Export Reports HTML
// @route  GET /api/v2/reports/exp
// @access Private

// exports.getExpReportsHTML = (req, res, next) => {
//     const lang = req.query.lang || 'ser';

//     res.status(200).render("expReports", {
//         title: "Izveštaji za inostrano tržište",
//         path: "exp",
//         lang,
//         userName: req.session.name
//     });
// };

// @desc   Export Reports - All
// @route  GET /api/v2/reports/exp/allReports
// @access Private

exports.getAllExpReportsHTML = asyncHandler(async(req, res) => {
    const reports = await ExpReport.find().populate("proizvod");
    //console.log(reports)

    res.status(200).render("domExpReportsAll", {
        title: "Izveštaji za inostrano tržište",
        path: "exp",
        userName: req.session.name,
        reports
    });
});

// @desc   Create Report
// @route  POST /api/v2/reports/exp
// @access Private

exports.createExpReport = asyncHandler( async(req, res, next) => {
    const lang = req.query.lang || 'ser';
    req.body.createdByUser = req.user.id;

    // za povlacenje podataka na osnovu sifre prpoizvoda
    const proizvod = await Product.findOne({sifra: req.body.sifra});
    req.body.proizvod = proizvod;

    // cupanje errors iz express-validatora
    const errors = validationResult(req);
    
    // validacija preko express-validatora
    // implementirano pamcenje prethodnog unosa
    if (!errors.isEmpty()) {
        return res.status(422).render("expReports", {
            title: "Izveštaji za inostrano tržište",
            path: "exp",
            lang,
            userName: req.session.name,
            errorMessage: errors.array()[0].msg,
            report: req.body,
            readonlyInputStatus: false
        })
    }

    const report = await ExpReport.create(req.body);

    res.status(201).render("expReports", {
        title: "Izveštaji za inostrano tržište",
        path: "exp",
        lang,
        userName: req.session.name,
        report,
        successMessage: 'Izveštaj je uspešno kreiran',
        readonlyInputStatus: false
    })
});

// @desc   Get All Reports
// @route  GET /api/v2/reports/exp/all
// @access Private

exports.getAllExpReports = asyncHandler( async(req, res, next) => {

//    const reports = await ExpReport.find().populate({
//        path: 'createdByUser',
//        select: 'name'
//    });

   res.status(200).json(res.advancedResults);
});


// @desc   Update Report
// @route  PUT /api/v2/reports/exp/:id
// @access Private

exports.updateExpReport = asyncHandler( async(req, res, next) => {
    
    let report = await ExpReport.findById(req.params.id);

    if (!report) {
        return next(new ErrorResponse('Zahtevani izvestaj ne postoji', 400));
    }
   
    req.body.updatedByUser = req.user.id;

    report = await ExpReport.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: false,
        new: true
    });

    res.status(200).json({
       success: true,
       data: report
   });
});

// @desc   Delete Report
// @route  DELETE /api/v2/reports/exp/:id
// @access Private

exports.deleteExpReport = asyncHandler( async(req, res, next) => {
    const lang = req.query.lang || 'ser';

    await ExpReport.findByIdAndDelete(req.params.id);

   res.status(200).render("expReports", {
        title: "Izveštaji za inostrano tržište",
        path: "exp",
        lang,
        userName: req.session.name,
        successMessage: 'Izveštaj je izbrisan'
    });
});
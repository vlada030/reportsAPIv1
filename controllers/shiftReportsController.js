const {validationResult} = require('express-validator');

const ShiftReport = require('../models/ShiftReport');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc   Get Shift Reports HTML
// @route  GET /api/v2/reports/shift
// @access Public

exports.getShiftReportsHTML = (req, res, next) => {

    res.status(200).render("shiftReports", {
        title: "Smenski izveštaj o radu",
        path: "shift",
        isAuthenticated: req.session.isLoggedIn,
        userName: req.session.name
    });
};

// @desc   Create Report
// @route  POST /api/v2/reports/shift
// @access Private

exports.createShiftReport = asyncHandler( async(req, res, next) => {

    req.body.createdByUser = req.user.id;

    // cupanje errors iz express-validator
    const errors = validationResult(req);
    //console.log(errors);

    if (!errors.isEmpty()) {
        return res.status(422).render("shiftReports", {
            title: "Smenski izveštaj o radu",
            path: "shift",
            userName: req.session.name,
            errorMessage: errors.array()[0].msg,
            report: req.body            
        })
    }

    const report = await ShiftReport.create(req.body);

    res.status(201).render("shiftReports", {
        title: "Smenski izveštaj o radu",
        path: "shift",
        userName: req.session.name,
        successMessage: 'Izveštaj je uspešno kreiran',
        report            
    })
});


// @desc   Get Report
// @route  GET /api/v2/reports/shift/:id
// @access Private

exports.getShiftReport = asyncHandler( async(req, res, next) => {

    const report = await ShiftReport.findById(req.params.id).populate({
        path: 'createdByUser',
        select: 'name'
    });

    //console.log(report)
 
    if (!report) {
        return res.status(404).render("shiftReports", {
            title: "Smenski izveštaj o radu",
            path: "shift",
            userName: req.session.name,
            errorMessage: 'Traženi izveštaj ne postoji ili je izbrisan.',
            report            
        });
    }
 
    res.status(200).render("shiftReports", {
        title: "Smenski izveštaj o radu",
        path: "shift",
        userName: req.session.name,
        report            
    });
 });

// @desc   Shift Reports - all
// @route  GET /api/v2/reports/shift/allReports
// @access Private
 exports.getAllShiftReportsHTML = asyncHandler(async(req, res) => {
    const reports = await ShiftReport.find().populate({
        path: 'createdByUser',
        select: 'name'
    });
    //console.log(reports);

    res.status(200).render("shiftReportsAll", {
        title: "Smenski izveštaj o radu",
        path: "shift",
        userName: req.session.name,
        reports
    });
});

// @desc   Get All Reports
// @route  GET /api/v2/reports/shift/all
// @access Private

exports.getAllShiftReports = asyncHandler( async(req, res, next) => {

    res.status(200).json(res.advancedResults);

    });

// @desc   Update Report
// @route  PUT /api/v2/reports/shift/:id
// @access Private

exports.updateShiftReport = asyncHandler( async(req, res, next) => {
    
    let report = await ShiftReport.findById(req.params.id);

    if (!report) {
        return next(new ErrorResponse('Zahtevani izvestaj ne postoji', 400));
    }
   
    req.body.updatedByUser = req.user.id;

    report = await ShiftReport.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: false,
        new: true
    });

    res.status(200).json({
       success: true,
       data: report
   });
});

// @desc   Delete Report
// @route  DELETE /api/v2/reports/shift/:id
// @access Private

exports.deleteShiftReport = asyncHandler( async(req, res, next) => {

    await ShiftReport.findByIdAndDelete(req.params.id);

    res.status(200).json({
       success: true,
       data: {}
    });
});
const DomReport = require("../models/DomReport");
const Product = require("../models/Product");

const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

const {validationResult} = require('express-validator');

// @desc   Get All Reports
// @route  GET /api/v1/reports/dom
// @access Private

exports.getAllDomReports = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        data: res.advancedResults
    });
    
});


// @desc   Create Report
// @route  POST /api/v1/reports/dom
// @access Private

exports.createDomReport = asyncHandler(async (req, res, next) => {
    // dodavanje logovanog korisnika
    req.body.createdByUser = req.user.id;

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
   
    const report = await DomReport.create(req.body);

    res.status(201).json({
        success: true,
        data: report
    })    
});

// @desc   Get Report
// @route  GET /api/v1/reports/dom/:id
// @access Private

exports.getDomReport = asyncHandler(async (req, res, next) => {
    const MISBroj = req.params.id;

    const report = await DomReport.findOne({ MISBroj })
        .populate({
            path: "createdByUser",
            select: "name",
        })
        .populate({
            path: "updatedByUser",
            select: "name",
        })
        .populate({
            path: "proizvod", 
            select: "proizvod " 
        }); // popunjava virtuals polje

    if (!report) {
        return next(
            new ErrorResponse(
                `Izveštaj sa MIS brojem ${MISBroj} ne postoji`,
                400
            )
        );
    }

    res.status(200).json({
        success: true,
        data: report
    });
}); 

// @desc   Update Report
// @route  PUT /api/v1/reports/dom/:id
// @access Private

exports.updateDomReport = asyncHandler(async (req, res, next) => {
    req.body.updatedByUser = req.user.id;
    const MISBroj = req.params.id;
    // ova provera je stavljena ovde da se baza sto manje opterecuje
    let report = await DomReport.findOne({ MISBroj });

    if (!report) {
        return next(new ErrorResponse(`Izveštaj sa MIS brojem ${MISBroj} ne postoji`, 404));
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



    report = await DomReport.findOneAndUpdate(
        { MISBroj },
        req.body,
        {
            new: true
        }
    );

    res.status(200).json({
        success: true,
        data: report
    });
});

// @desc   Delete Report
// @route  DELETE /api/v1/reports/dom/:id
// @access Private

exports.deleteDomReport = asyncHandler(async (req, res, next) => {
    // prvo proveri da li izvestaj postoji
    const MISBroj = req.params.id;

    const report = await DomReport.findOne({MISBroj});

    if (!report) {
        return next(
            new ErrorResponse(
                `Izveštaj sa MIS brojem ${MISBroj} ne postoji`,
                400
            )
        );
    }

    await DomReport.findOneAndDelete({ MISBroj: req.params.id });

    res.status(200).json({
        success: true,
        data: "Izveštaj uspešno obrisan."
    });
    
});

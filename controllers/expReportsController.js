const ExpReport = require('../models/ExpReport');
const Product = require('../models/Product');

const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

const {validationResult} = require('express-validator');

// @desc   Get All Reports
// @route  GET /api/v1/reports/exp/all
// @access Private

exports.getAllExpReports = asyncHandler( async(req, res, next) => {

    //    const reports = await ExpReport.find().populate({
    //        path: 'createdByUser',
    //        select: 'name'
    //    });
    
       res.status(200).json({
           success: true,
           data: res.advancedResults});
    });

// @desc   Get Report
// @route  GET /api/v1/reports/exp
// @access Private

exports.getExpReport = asyncHandler( async(req, res, next) => {

    const id = req.params.id;

    const report = await ExpReport.findById(id)
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
                `Izveštaj sa id brojem ${id} ne postoji`,
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        data: report
    });
});


// @desc   Create Report
// @route  POST /api/v1/reports/exp
// @access Private

exports.createExpReport = asyncHandler( async(req, res, next) => {
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
   
    const report = await ExpReport.create(req.body);

    res.status(201).json({
        success: true,
        data: report
    })
});


// @desc   Update Report
// @route  PUT /api/v1/reports/exp/:id
// @access Private

exports.updateExpReport = asyncHandler( async(req, res, next) => {
    
    req.body.updatedByUser = req.user.id;
    const id = req.params.id;
    
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

    // proveri da li izveštaj postoji nakon validacije, da se ne opterecuje baza bezveze
    let report = await ExpReport.findById(id);

    if (!report) {
        return next(new ErrorResponse(`Izveštaj sa Id brojem ${id} ne postoji`, 400));
    }


    report = await ExpReport.findByIdAndUpdate(
        id,
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
// @route  DELETE /api/v1/reports/exp/:id
// @access Private

exports.deleteExpReport = asyncHandler( async(req, res, next) => {
    // prvo proveri da li izvestaj postoji
    const id = req.params.id;

    const report = await ExpReport.findById(id);

    if (!report) {
        return next(
            new ErrorResponse(
                `Izveštaj sa id brojem ${id} ne postoji`,
                404
            )
        );
    }

    await ExpReport.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        data: "Izveštaj uspešno obrisan."
    });
});
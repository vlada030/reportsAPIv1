const {validationResult} = require('express-validator');

const ShiftReport = require('../models/ShiftReport');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc   Get All Reports
// @route  GET /api/v1/reports/shift/all
// @access Private

exports.getAllShiftReports = asyncHandler( async(req, res, next) => {
    
    res.status(200).json(res.advancedResults);
    
});


// @desc   Get Report
// @route  GET /api/v1/reports/shift/:id
// @access Private

exports.getShiftReport = asyncHandler( async(req, res, next) => {

    const id = req.params.id;

    const report = await ShiftReport.findById(id)
        .populate({
            path: "createdByUser",
            select: "name",
        })
        .populate({
            path: "updatedByUser",
            select: "name",
        })
        
    if (!report) {
        return next(
            new ErrorResponse(
                `Izveštaj sa id brojem ${id} ne postoji`,
                400
            )
        );
    }

    res.status(200).json({
        success: true,
        data: report
    });

 });

// @desc   Create Report
// @route  POST /api/v1/reports/shift
// @access Private

exports.createShiftReport = asyncHandler( async(req, res, next) => {

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
   
    const report = await ShiftReport.create(req.body);

    res.status(201).json({
        success: true,
        data: report
    })
});


// @desc   Update Report
// @route  PUT /api/v1/reports/shift/:id
// @access Private

exports.updateShiftReport = asyncHandler( async(req, res, next) => {
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
    let report = await ShiftReport.findById(id);

    if (!report) {
        return next(new ErrorResponse(`Izveštaj sa Id brojem ${id} ne postoji`, 400));
    }

    if (req.user.id !== report.createdByUser.toString()) {
        return next(new ErrorResponse(`Možete vršiti izmene samo na izveštaju koji ste vi kreirali`, 403));
    }

    report = await ShiftReport.findByIdAndUpdate(
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
// @route  DELETE /api/v1/reports/shift/:id
// @access Private

exports.deleteShiftReport = asyncHandler( async(req, res, next) => {

    // prvo proveri da li izvestaj postoji
    const id = req.params.id;

    const report = await ShiftReport.findById(id);

    if (!report) {
        return next(
            new ErrorResponse(
                `Izveštaj sa id brojem ${id} ne postoji`,
                400
            )
        );
    }

    await ShiftReport.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        data: "Izveštaj uspešno obrisan."
    });
});
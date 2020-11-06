// expressov default error handler prilikom greske izbacuje html gde stoji greska i status 500
// zato pravimo custom error middleware, obavezno sadrzi err pored req...

// da bi u controlleru imali samo next(err) ovde ubacujemo prosirenu klasu ErrorResponse
// sa mogucim greskama
const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {

    let error = {...err};
    
    // kada iz controllera posaljemo ErrorResponse message mora ova linija da bi se videla
    error.message = err.message;

    // console.log(err.stack.red);
    // console.log(err.message.bgCyan);
    // console.log(err);

    // CastError vraca za sve CRUD operacije u try/catch
    // kada unesemo los id..
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplikat vrednosti koje su postavljene kao required: unique
    if (err.code === 11000) {
        const message = `Duplicate field value entered.`;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose greska prilikom validacije polja
    // err vraca .errors koji sadrzi arr svih gresaka i odatle cupamo message itd
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(err => err.message);
        error = new ErrorResponse(message, 400);
    }

    // greška koju vraca multer za limits - fileSize
    if (error.code === 'LIMIT_FILE_SIZE') {
        const message = 'Maksimalna veličina avatar slike je 5MB';
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false, 
        error: error.message || "Server Error"
    });
};

module.exports = errorHandler;
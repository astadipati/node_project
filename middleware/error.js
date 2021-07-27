const ErrorResponse = require("../helper/errorResponse");

const errorHandler = (err, req, res, next) =>{
    // 1. kita perlu ambil semua object fungsi diatas dan menaruhnya dalam variabel baru error
    let error = {...err}
    error.message= err.message;

// log All entire error to console for dev
    console.log(err);
// monggose bad objectid
    if(err.name === 'CastError'){
        const message = `Bad Object, ID not found ${err.value}`;
        // 2. sehingga bisa kita passing disini
        error =  new ErrorResponse(message, 404);
    }

    // mongoose duplicate key
    if(err.code === 11000){
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        // kita ambil seluruh object error dan ekstrak dengan map
        const message = Object.values(err.errors).map(val => val.message);
        // kita kembalikan datanya
        error = new ErrorResponse(message, 400);
    }
    // console.log(err.name.yellow.bold);
    res.status(error.statusCode || 500 ).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
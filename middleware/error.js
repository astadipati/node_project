const ErrorResponse = require("../helper/errorResponse");

const errorHandler = (err, req, res, next) =>{
    // 1. kita perlu ambil semua object fungsi diatas dan menaruhnya dalam variabel baru error
    let error = {...err}
    error.message= err.message;

// log to console for dev
    console.log(err.stack.red);
// monggose bad objectid
    if(err.name === 'CastError'){
        const message = `Bad Object ID not found ${err.value}`;
        // 2. sehingga bisa kita passing disini
        error =  new ErrorResponse(message, 404);

    }
    console.log(err.name.yellow.bold);
    res.status(error.statusCode || 500 ).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
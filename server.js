const express = require('express');
const dotenv = require('dotenv');
// morgan untuk logger pihak3
const morgan = require('morgan');
// colors
const colors = require('colors');
// errorHandler dari middleware
const errorHandler = require('./middleware/error');
// konek db
const connectDB = require('./config/db');
// load env Parameters
dotenv.config({path:'./config/config.env'});

// load konek to DB
connectDB();

//load route file as middleware
const bootcamps = require('./routes/bootcamps');

const app = express();

// pengganti bodyparser sudah include di express
app.use(express.json());

// const logger = (req, res, next) => {
//     req.hello = 'Hello';
//     console.log('Ini Middleware'); //semenjak memiliki middleware ini bisa dipanggil di route
    // dan setiap midleware yang dibuat harus next
//     next();
// }

// app.use(logger);
// Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


//mount router
app.use('/api/v1/bootcamp',bootcamps);

// pastikan error handler setelah mount router supaya terbaca bisa digunakan
app.use(errorHandler);

const MODE = process.env.NODE_ENV;
const PORT = process.env.PORT;

const server = app.listen(
    PORT,
    console.log(`Server running in -${MODE}- mode on port ${PORT}`.blue.bold)
);

//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.underline);
    // close server & exit
    server.close(()=> process.exit(1));
});

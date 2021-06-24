const express = require('express');
const dotenv = require('dotenv');
//load route file as middleware
const bootcamps = require('./routes/bootcamps');
// load env Parameters
dotenv.config({path:'./config/config.env'});

const app = express();

//mount router
app.use('/api/v1/bootcamps',bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in -${process.env.NODE_ENV}- mode on port ${PORT}`));
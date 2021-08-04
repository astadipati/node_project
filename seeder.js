const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require ('dotenv');

// load env vars
dotenv.config ({path: './config/config.env'});

const Bootcamp = require('./models/Bootcamp');
// konek db
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));

// import into db
const importData = async() =>{
    try {
        await Bootcamp.create(bootcamps);
        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

// Delete data db
const deleteData = async() =>{
    try {
        await Bootcamp.deleteMany(bootcamps);
        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

// kita coba cek process ke dua misal node seeder -i
if (process.argv[2] === '-i') {
    importData();
}else if (process.argv[2] === '-d'){
    deleteData();
}
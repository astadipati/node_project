// panggil helper
// const ErrorResponse = require('../helper/errorResponse');
// kita load models
const ErrorResponse = require('../helper/errorResponse');
// kita load geocoder
const geocoder = require('../helper/geoCoder'); 
// kita terapkan DRY Dont Repeat Yourself untuk error handling
// middleware ini akan menggantikan try catch berulang
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// dalam controller = method
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamp
// @access  Public

exports.getBootcamps = asyncHandler(async (req, res, next) =>{ //midleware function
    // kita akan ambil data dan replace jadi $gt
    let query;
    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // console.log(queryStr);
    query = Bootcamp.find(JSON.parse(queryStr));

    // const bootcamps = await Bootcamp.find(); berubah menunggu query
    const bootcamps = await query;
        res
            .status(200)
            .json({success: true, jml: bootcamps.length, data: bootcamps}); //sekaligus akses middleware logger
    
}); 
// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamp/:id
// @access  Public

exports.getBootcamp = asyncHandler(async (req, res, next) =>{ //midleware function
    // try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        // jika sesuai format tapi tidak ada data
        if (!bootcamp) {
            // kita kembalikan dengan return
            // next(err);
            return next(
                // res.status(400).json({success: false, msg: `Tidak ada data`})
                new ErrorResponse(`ID tidak ditemukan ${req.params.id}`, 404)
            )
        };
        res
            .status(200)
            .json({success: true, data: bootcamp});
    // } catch (err) {
        // next(err);
        // res
        //     .status(400)
        //     .json({success:false});
        // next(new ErrorResponse(`Bootcamp nor found with id of ${req.params.id}`, 404));
    // }
    // res.status(200).json({success: true, msg: `get single bootcamps ${req.params.id}`});
});  

// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamp
// @access  Private after login

exports.createBootcamp = asyncHandler(async (req, res, next) =>{ //midleware function
    // try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
        
    // } catch (err) {
    //     next(err);
        // res
        // .status(400)
        // .json({success:false, msg:`Cek duplikat`});
    // }
    // console.log(req.body);
    // res.status(200).json({success: true, msg: 'Create new bootcamps'});
});  

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamp:id
// @access  Private

exports.updateBootcamp = asyncHandler(async (req, res, next) =>{ //midleware function
    // try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        });
        res.status(200).json({success: true, msg: `Update bootcamps ${req.params.id}`, data: bootcamp});
        if (!bootcamp) {
            // return res.status(400).json({success: false, msg:`Gagal Update`});
            return next(
                // res.status(400).json({success: false, msg: `Tidak ada data`})
                new ErrorResponse(`ID tidak ditemukan ${req.params.id}`, 404)
            )
        }
    // } catch (error) {
    //     next(err);
        // res
        // .status(400)
        // .json({success:false, msg:`Gagal Melakukan Update ${req.params.id}`});
    // }
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamp/:id
// @access  private

exports.deleteBootcamp =asyncHandler(async (req, res, next) =>{ //midleware function
    // try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        res.status(200).json({success: true, msg: `Delete bootcamps ${req.params.id}`});
        if (!bootcamp) {
            return next(
                // res.status(400).json({success: false, msg: `Tidak ada data`})
                new ErrorResponse(`ID tidak ditemukan ${req.params.id}`, 404)
            )
            // return res.status(400).json({success: false, msg:`Gagal Hapus Data`});
        }
    // } catch (error) { 
    //     next(err);
        // res
        // .status(400)
        // .json({success:false, msg:`Gagal Menghapus Data ${req.params.id}`});
    // }
});  

// @desc    Get Booctamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  private

exports.getBootcampsInRadius =asyncHandler(async (req, res, next) =>{ //midleware function
    const {zipcode, distance} = req.params;

    // Get lat/lng from geocoder
    const loc =  await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3.963 mi / 6.378 km
    const radius = distance / 3963; //in mile
    // console.log(radius);
    // process.exit;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {$centerSphere: [[lng, lat], radius]}
        }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});  
// panggil helper
// const ErrorResponse = require('../helper/errorResponse');
// kita load models
const ErrorResponse = require('../helper/errorResponse');
const Bootcamp = require('../models/Bootcamp');

// dalam controller = method
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamp
// @access  Public

exports.getBootcamps = async (req, res, next) =>{ //midleware function
    try {
        const bootcamps = await Bootcamp.find();
        res
            .status(200)
            .json({success: true, jml: bootcamps.length, data: bootcamps}); //sekaligus akses middleware logger
    } catch (err) {
        next(err);
        // res
        //     .status(400)
        //     .json({success:false});
    }
}; 
// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamp/:id
// @access  Public

exports.getBootcamp = async (req, res, next) =>{ //midleware function
    try {
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
    } catch (err) {
        next(err);
        // res
        //     .status(400)
        //     .json({success:false});
        // next(new ErrorResponse(`Bootcamp nor found with id of ${req.params.id}`, 404));
    }
    // res.status(200).json({success: true, msg: `get single bootcamps ${req.params.id}`});
};  

// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamp
// @access  Private after login

exports.createBootcamp = async (req, res, next) =>{ //midleware function
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
        
    } catch (error) {
        // next(err);
        res
        .status(400)
        .json({success:false, msg:`Cek duplikat`});
    }
    // console.log(req.body);
    // res.status(200).json({success: true, msg: 'Create new bootcamps'});
};  

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamp:id
// @access  Private

exports.updateBootcamp = async (req, res, next) =>{ //midleware function
    try {
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
    } catch (error) {
        next(err);
        // res
        // .status(400)
        // .json({success:false, msg:`Gagal Melakukan Update ${req.params.id}`});
    }
};
// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamp/:id
// @access  private

exports.deleteBootcamp =async (req, res, next) =>{ //midleware function
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        res.status(200).json({success: true, msg: `Delete bootcamps ${req.params.id}`});
        if (!bootcamp) {
            return next(
                // res.status(400).json({success: false, msg: `Tidak ada data`})
                new ErrorResponse(`ID tidak ditemukan ${req.params.id}`, 404)
            )
            // return res.status(400).json({success: false, msg:`Gagal Hapus Data`});
        }
    } catch (error) { 
        next(err);
        // res
        // .status(400)
        // .json({success:false, msg:`Gagal Menghapus Data ${req.params.id}`});
    }
};  
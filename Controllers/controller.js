const recordModel = require("../Models/model");

exports. createRecord = async (req, res)=>{
    try {
        const { math, english } = req.body
        const record = new recordModel({
            math,
            english
        })
        const savedRecords = await record.save()
        res.status(201).json({
            data: savedRecords
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports. getRecords = async (req, res)=>{
    try {
        const authenticated = await userModel.findById(req.params.id)
        const records = await recordModel.find()
        res.status(201).json({
            data: records
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports. getRecord = async (req, res)=>{
    try {
        const {id} = req.params;
        const record = await recordModel.findById(id)
        res.status(201).json({
            data: record
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.updateRecord = async (req, res)=>{
    try {
        const {id} = req.params;
        const { math, english } = req.body
        const data = {
            math,
            english
        }
        const updatedrecord = await recordModel.findByIdAndUpdate(id, data, {new: true})
        res.status(201).json({
            data: updatedrecord
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.deleteRecord = async (req, res)=>{
    try {
        const {id} = req.params;
        const deleterecord = await recordModel.findByIdAndDelete(id)
        res.status(201).json({
            message: 'Record deleted successfully',
            data: deleterecord,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}




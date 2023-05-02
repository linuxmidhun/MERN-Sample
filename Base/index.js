const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const sampleRoutes = express.Router();

let Sample = require('./sample.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://midhunmadhavan:Abcd!234@generalcluster.k1t5r0t.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, dbName: 'SampleDb' });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

// get all samples
sampleRoutes.route('/').get(async function (req, res) {
    const samples = await Sample.find().catch(_ => {
        res.status(400).send({
            status: 400,
            message: "fetching data failed"
        });
    });
    res.status(200).send({
        status: 200,
        message: "Found " + samples.length + " rows of data",
        data: samples
    });
});

// get selected sample
sampleRoutes.route('/:id').get(async function (req, res) {
    let id = req.params.id;
    const sample = await Sample.findById(id)
        .catch(err => {
            res.status(400).send({
                status: 400,
                message: 'fetching data failed'
            });
        });
    if (!sample)
        res.status(404).send({
            status: 404,
            message: "data is not found"
        });
    else
        res.status(200).send({
            status: 200,
            message: "Data found",
            data: sample
        });
});

// add a sample item with post method
sampleRoutes.route('/').post(function (req, res) {
    let sample = new Sample(req.body);
    sample.save()
        .then(sample => {
            res.status(200).json({
                status: 200,
                message: 'Sample added successfully'
            });
        })
        .catch(err => {
            res.status(400).send({
                status: 400,
                message: 'adding new sample failed'
            });
        });
});

// update selected sample with put method
sampleRoutes.route('/:id').put(async function (req, res) {
    let id = req.params.id;
    const sample = await Sample.findById(id).catch(err => {
        res.status(400).send({
            status: 400,
            message: "Update not possible"
        });
    });;
    if (!sample)
        res.status(404).send({
            status: 404,
            message: "data is not found"
        });
    else {
        sample.sample_name = req.body.sample_name;
        sample.sample_note = req.body.sample_note;
        sample.save().then(todo => {
            res.status(200).json({
                status: 200,
                message: 'Sample updated successfully'
            });
        })
    }
});


// delete selected sample
sampleRoutes.route('/:id').delete(async function (req, res) {
    let id = req.params.id;
    await Sample.deleteOne(id)
        .then(_=> {
            res.status(200).send({
                status: 200,
                message: "Data deleted"
            });
        })
        .catch(err => {
            res.status(400).send({
                status: 400,
                message: 'deleting data failed'
            });
        })
    // if (!sample)
    //     res.status(404).send({
    //         status: 404,
    //         message: "data is not found"
    //     });
    // else
});

app.use('/sample', sampleRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
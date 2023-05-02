const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Sample = new Schema({
    sample_name: {
        type: String
    },
    sample_note: {
        type: String
    }
});
module.exports = mongoose.model('Sample', Sample);
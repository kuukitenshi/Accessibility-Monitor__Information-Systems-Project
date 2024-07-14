const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EvaluationSchema = new Schema({
    report: { type: Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);

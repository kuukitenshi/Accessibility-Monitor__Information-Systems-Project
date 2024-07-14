const mongoose = require('mongoose');
const Evaluaton = require('../models/evaluation');

const Schema = mongoose.Schema;

const WebpageSchema = new Schema({
    url: { type: String, required: true },
    state: { type: String, required: true, enum: ['accepted', 'rejected', 'not evaluated', 'in evaluation', 'error in evaluation'], default: 'not evaluated' },
    website: { type: Schema.Types.ObjectId, ref: "Website", required: true },
    last_evaluation_date: { type: Date, required: false },
    evaluation: { type: Schema.Types.ObjectId, ref: "Evaluation", required: false },
});

WebpageSchema.post('findOneAndDelete', async function(doc) {
    if (doc.evaluation) {
        await Evaluaton.findByIdAndDelete(doc.evaluation).exec();
    }
});

module.exports = mongoose.model('Webpage', WebpageSchema);
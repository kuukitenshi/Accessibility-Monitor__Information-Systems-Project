const mongoose = require('mongoose');
const Webpage = require('../models/webpage');

const Schema = mongoose.Schema;

const WebsiteSchema = Schema({
    url: { type: String, required: true },
    creation_date: { type: Date, default: Date.now, required: true },
    last_evaluation_date: { type: Date, required: false},
    state: { type: String, required: true, enum: ['not evaluated', 'in evaluation', 'evaluated', 'error in evaluation'], default: 'not evaluated' }
});

WebsiteSchema.post('findOneAndDelete', async function(doc) {
    await Webpage.find({website: doc._id}).deleteMany().exec();
});

module.exports = mongoose.model('Website', WebsiteSchema);

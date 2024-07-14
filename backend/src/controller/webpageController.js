const asyncHandler = require("express-async-handler");
const Webpage = require('../models/webpage');
const { validateUrl } = require('../utils/urlValidator');
const { updateWebsiteState } = require('../utils/websiteUtils');

exports.webpage_list = asyncHandler(async (req, res) => {
    try {
        let webpages;
        const websiteQuery = req.query.website;
        if (websiteQuery) {
            webpages = await Webpage.find({ 'website': websiteQuery }).populate('website').populate('evaluation').exec();
        } else {
            webpages = await Webpage.find().exec();
        }
        res.json(webpages);
    } catch {
        res.sendStatus(404);
    }
});

exports.webpage_get = asyncHandler(async (req, res) => {
    try {
        const webpage = await Webpage.findById(req.params.id).populate('website').populate('evaluation').exec();
        res.json(webpage);
    } catch {
        res.sendStatus(404);
    }
});

exports.webpage_create = asyncHandler(async (req, res) => {
    try {
        const url = validateUrl(req.body.url);
        if (url) {
            const webpage = new Webpage(req.body);
            await webpage.save();
            res.json(webpage);
            return;
        }
    } catch { }
    res.sendStatus(400);
});

exports.webpage_delete = asyncHandler(async (req, res) => {
    try {
        const webpage = await Webpage.findByIdAndDelete(req.params.id).populate('website').populate('evaluation').exec();
        await updateWebsiteState(webpage.website);
        await webpage.website.save();
        res.json(webpage);
    } catch (e) {
        res.sendStatus(404);
    }
});

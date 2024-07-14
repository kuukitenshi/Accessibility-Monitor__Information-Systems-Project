const asyncHandler = require("express-async-handler");
const Website = require('../models/website');
const Webpage = require('../models/webpage');
const Evaluation = require('../models/evaluation');
const { validateUrl } = require('../utils/urlValidator');
const qualweb = require('../utils/qualweb');
const { updateWebsiteState, buildData } = require('../utils/websiteUtils');
const os = require('os');
const uuid = require('uuid');
const fs = require('node:fs/promises');
const path = require('path');
const puppeteer = require('puppeteer');

exports.website_list = asyncHandler(async (req, res) => {
    try {
        const websites = await Website.find().exec();
        res.json(websites);
    } catch {
        res.status(404).json(new Error(`Website with id ${req.params.id} does not exist!`));
    }
});

exports.website_get = asyncHandler(async (req, res) => {
    try {
        const website = await Website.findById(req.params.id).exec();
        res.json(website);
    } catch {
        res.status(404).json(new Error(`Website with id ${req.params.id} does not exist!`));
    }
});

exports.website_create = asyncHandler(async (req, res) => {
    try {
        const url = validateUrl(req.body.url);
        if (url) {
            const website = new Website(req.body);
            await website.save();
            res.json(website);
            return;
        }
    } catch { }
    res.status(400).json(new Error('Request url is invalid!'));
});

exports.website_delete = asyncHandler(async (req, res) => {
    try {
        const website = await Website.findByIdAndDelete(req.params.id).exec();
        res.json(website);
    } catch (e) {
        res.status(404).json(new Error(`Website with id ${req.params.id} does not exist!`));
    }
});

exports.website_evaluation = asyncHandler(async (req, res) => {
    try {
        const website = await Website.findByIdAndUpdate(req.params.id, { state: 'in evaluation' }).exec();
        const webpages = await Promise.all(req.body.webpages.map(async webpage_id =>
            await Webpage.findByIdAndUpdate(webpage_id, { state: 'rejected' }).exec()
        ));
        const urls = webpages.map(w => w.url);
        const evaluationReport = await qualweb.evaluateUrls(urls);

        await Promise.all(webpages.map(async webpage => {
            if (webpage.url in evaluationReport) {
                updateWebpageState(webpage, evaluationReport[webpage.url]);
                const evaluation = new Evaluation({report: evaluationReport[webpage.url]});
                await evaluation.save();
                webpage.evaluation = evaluation;
            } else {
                webpage.state = 'error in evaluation';
            }
            webpage.last_evaluation_date = new Date();
            return await webpage.save();
        }));
        website.last_evaluation_date = new Date();
        await updateWebsiteState(website);
        await website.save();
        res.json({ website: website, webpages: webpages });
    } catch (e) {
        res.status(404).json(new Error(`Website with id ${req.params.id} does not exist!`));
    }
});

exports.website_report = asyncHandler(async (req, res) => {
    try {
        const website = await Website.findById(req.params.id).exec();
        if (website) {
            const data = await buildData(website);
            res.render('report', data, async (err, htmlContent) => {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                const type = req.accepts(['html', 'pdf']);
                const tempDir = path.join(os.tmpdir(), 'accessibility-monitor');
                await fs.mkdir(tempDir, { recursive: true });
                const filePath = path.join(tempDir, uuid.v4() + ".html");
                if (type === 'html') {
                    await fs.writeFile(filePath, htmlContent);
                    res.download(filePath);
                } else if (type === 'pdf') {
                    const launchOptions = {
                        headless: 'new',
                        args: [
                            '--no-sandbox',
                            '--ignore-certificate-errors'
                        ]
                    }
                    const browser = await puppeteer.launch(launchOptions);
                    const page = await browser.newPage();
                    await page.setContent(htmlContent);
                    await page.pdf({ path: filePath, format: 'A4', printBackground: true });
                    await browser.close();
                    res.download(filePath);
                } else {
                    res.sendStatus(400);
                }
            });
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.sendStatus(404);
    }
});

function updateWebpageState(webpage, report) {
    webpage.state = 'accepted';
    for (const moduleName of Object.keys(report['modules'])) {
        const module = report['modules'][moduleName];
        for (const code of Object.keys(module['assertions'])) {
            const check = module['assertions'][code];
            if (check.metadata && check.metadata.outcome === 'failed') {
                for (const criteria of check.metadata['success-criteria']) {
                    const level = criteria.level;
                    if (level === 'A' || level === 'AA') {
                        webpage.state = 'rejected';
                        return;
                    }
                }
            }
        }
    }
}

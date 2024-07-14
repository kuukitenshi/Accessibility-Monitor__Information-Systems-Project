const express = require('express')
const path = require( 'path')
const fs = require( 'node:fs')
const puppeteer = require( 'puppeteer')

const app = express();
const port = 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'views/static')));

app.get('/', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'views', 'static', 'data.json'), 'utf-8'));
    res.render('report', data);
});

app.get('/pdf', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'views', 'static', 'data.json'), 'utf-8'));
    res.render('report', data, async (err, htmlContent) => {
        const filePath = path.join(__dirname, 'report.pdf');
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ format: 'A4', path: filePath, printBackground: true });
        await browser.close();
        res.sendFile(filePath);
    })
});


app.listen(port, () => {
    console.log('Started!');
});
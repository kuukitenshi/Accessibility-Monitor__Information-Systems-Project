const { QualWeb } = require('@qualweb/core');

const qualwebSettings = {
    plugins: {
        adBlock: false,
        stealth: true
    },
    clusterOptions: {
        timeout: 60 * 1000
    },
    launchOptions: {
        headless: 'new',
        args: [
            '--no-sandbox',
            '--ignore-certificate-errors'
        ]
    },
    executionOptions: {
        act: true,
        wcag: true,
        bp: false
    }
};

async function evaluateUrls(urls) {
    try {
        const qualweb = new QualWeb(qualwebSettings.plugins);
        await qualweb.start(qualwebSettings.clusterOptions, qualwebSettings.launchOptions);
        const report = await qualweb.evaluate({ urls: urls, execute: qualwebSettings.executionOptions });
        await qualweb.stop();
        return report;
    } catch {
        console.error('Qualweb failed to evaluate urls: ' + urls);
    }
    return {};
}

module.exports = { evaluateUrls };

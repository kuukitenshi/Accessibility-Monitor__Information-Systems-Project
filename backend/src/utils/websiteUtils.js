const Webpage = require('../models/webpage');

async function updateWebsiteState(website) {
    const webpages = await Webpage.find({ website: website._id }).exec();
    website.state = 'not evaluated';
    if (!webpages)
        return;
    for (const webpage of webpages) {
        if (webpage.state === 'in evaluation') {
            website.state = 'in evaluation';
            return;
        } else if (webpage.state === 'error in evaluation') {
            website.state = 'error in evaluation';
            return;
        } else if (webpage.state !== 'not evaluated') {
            website.state = 'evaluated';
        }
    }
}

async function buildData(website) {
    const websiteUrl = website.url;
    const reportDate = new Date().toLocaleDateString().substring(0, 10);
    const registerDate = website.creation_date.toLocaleDateString().substring(0, 10);
    const websiteState = website.state;
    const websiteEvalDate = website.last_evaluation_date.toLocaleDateString();
    const webpages = await Webpage.find({ website: website }).populate('evaluation').exec();
    if (webpages && webpages.length > 0) {
        let totalEvaluatedPages = webpages.filter(w => w.evaluation).length;
        let numPagesWithOneError = 0;
        let numPagesWithOneAError = 0;
        let numPagesWithOneAAError = 0;
        let numPagesWithOneAAAError = 0;
        let numPagesWithNoErrors = 0;
        let mostCommonErrors = [];
        for (const evaluation of webpages.filter(w => w.evaluation).map(w => w.evaluation.report)) {
            if (evaluation['metadata']['failed'] === 0) {
                numPagesWithNoErrors++;
                continue;
            } else {
                numPagesWithOneError++;
            }
            let hasA = false;
            let hasAA = false;
            let hasAAA = false;
            for (const moduleName of Object.keys(evaluation['modules'])) {
                const module = evaluation['modules'][moduleName];
                for (const assertionName of Object.keys(module['assertions'])) {
                    const assertion = module['assertions'][assertionName];
                    if (assertion['metadata']['outcome'] === 'failed') {
                        const error = mostCommonErrors.find(e => e.code === assertion.code);
                        if (error) {
                            error.count++;
                        } else {
                            mostCommonErrors.push({code: assertion.code, description: assertion.description, count: 1})
                        }
                        for (const check of assertion['metadata']['success-criteria']) {
                            if (check.level === 'A')
                                hasA = true;
                            if (check.level === 'AA')
                                hasAA = true;
                            if (check.level === 'AAA')
                                hasAAA = true;
                        }

                    }
                }
            }
            if (hasA)
                numPagesWithOneAError++;
            if (hasAA)
                numPagesWithOneAAError++;
            if (hasAAA)
                numPagesWithOneAAAError++;
        }
        mostCommonErrors = mostCommonErrors.sort((e1, e2) => e2.count - e1.count).slice(0, 10);
        const percPagesWithNoErrors = roundNumber(numPagesWithNoErrors / totalEvaluatedPages * 100) ?? 0;
        const percPagesWithOneError = roundNumber(numPagesWithOneError / totalEvaluatedPages * 100) ?? 0;
        const percPagesWithOneAError = roundNumber(numPagesWithOneAError / totalEvaluatedPages * 100) ?? 0;
        const percPagesWithOneAAError = roundNumber(numPagesWithOneAAError / totalEvaluatedPages * 100) ?? 0;
        const percPagesWithOneAAAError = roundNumber(numPagesWithOneAAAError / totalEvaluatedPages * 100) ?? 0;
        const data = {
            websiteUrl: websiteUrl,
            reportDate: reportDate,
            registerDate: registerDate,
            websiteState: websiteState[0].toUpperCase() + websiteState.substring(1).toLowerCase(),
            websiteEvaluationDate: websiteEvalDate,

            numPagesWithNoErrors: numPagesWithNoErrors,
            numPagesWithOneError: numPagesWithOneError,
            numPagesWithOneAError: numPagesWithOneAError,
            numPagesWithOneAAError: numPagesWithOneAAError,
            numPagesWithOneAAAError: numPagesWithOneAAAError,
            totalEvaluatedPages: totalEvaluatedPages,

            percPagesWithNoErrors: percPagesWithNoErrors,
            percPagesWithOneError: percPagesWithOneError,
            percPagesWithOneAError: percPagesWithOneAError,
            percPagesWithOneAAError: percPagesWithOneAAError,
            percPagesWithOneAAAError: percPagesWithOneAAAError,

            mostCommonErrors: mostCommonErrors,

            webpages: webpages?.map(w => {
                return {
                    outcome: w.state.replace(' ', '-').toLocaleLowerCase(),
                    outcome_display: w.state[0].toUpperCase() + w.state.substring(1).toLowerCase(),
                    url: w.url,
                    last_evaluation_date: w.last_evaluation_date?.toLocaleDateString().substring(0, 10) ?? "",
                };
            })
        };
        return data;
    }
    return {};
}

function roundNumber(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

module.exports = { updateWebsiteState, buildData };
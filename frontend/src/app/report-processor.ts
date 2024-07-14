export interface CommonError {
    code: string;
    description: string,
    count: number;
}

export function getAllErrors(report: any): CommonError[] {
    const commonErrors: CommonError[] = []
    for (const moduleName of Object.keys(report.modules)) {
        const module = report.modules[moduleName];
        for (const assertionName of Object.keys(module['assertions'])) {
            const assertion = module['assertions'][assertionName];
            if (assertion['metadata']['outcome'] === 'failed') {
                const error = commonErrors.find(e => e.code === assertion.code);
                if (error)
                    error.count++;
                else
                    commonErrors.push({code: assertion.code, description: assertion.description, count: 1});
            }
        }
    }
    return commonErrors;
}

export function aggregateErrors(reports: any[]): CommonError[] {
    const aggregatedErrors: CommonError[] = [];
    reports.forEach(report => {
        const errors = getAllErrors(report);
        errors.forEach(e => {
            const error = aggregatedErrors.find(ae => ae.code === e.code);
            if (error)
                error.count += e.count;
            else
                aggregatedErrors.push({code: e.code, description: e.description, count: e.count});
        });
    })
    return aggregatedErrors;
}
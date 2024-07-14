export interface Evaluation {
    report: any;
}

export interface EvaluationAssertion {
    code: string,
    description: string,
    outcome: TestResult,
    type: AssertionType,
    levels: AssertionLevel[],
    results: AssertionResult[]
}

export interface AssertionResult {
    verdict: TestResult,
    description: string,
    code: string,
    elements: ResultElement[]
}

export interface ResultElement {
    htmlCode: string,
    pointer: string
}

export enum TestResult {
    INAPPLICABLE = "inapplicable",
    WARNING = "warning",
    FAILED = "failed",
    PASSED = "passed"
}

export enum AssertionLevel {
    A = "A",
    AA = "AA",
    AAA = "AAA"
}

export enum AssertionType {
    WCAG = "wcag",
    ACT = "act"
}
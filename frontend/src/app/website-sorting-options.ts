import { Website } from "./website"

export interface SortingOption {
    value: string,
    name: string,
    sortFunction: (a: Website, b: Website) => number,
    fontIcon: string
};

export const CREATION_DATE_ASC: SortingOption = {
    value: 'creation_date_asc',
    name: 'Creation date',
    sortFunction: (a, b) => a.creation_date.getTime() - b.creation_date.getTime(),
    fontIcon: 'arrow_upward_alt'
}

export const CREATION_DATE_DESC: SortingOption = {
    value: 'creation_date_desc',
    name: 'Creation date',
    sortFunction: (a, b) => b.creation_date.getTime() - a.creation_date.getTime(),
    fontIcon: 'arrow_downward_alt'
}

export const LAST_EVALUATED_DATE_ASC: SortingOption = {
    value: 'last_evaluated_date_asc',
    name: 'Last evaluated date',
    sortFunction: (a, b) => compareLastEvaluationData(a, b, false),
    fontIcon: 'arrow_upward_alt'
}

export const LAST_EVALUATED_DATE_DESC: SortingOption = {
    value: 'last_evaluated_date_desc',
    name: 'Last evaluated date',
    sortFunction: (a, b) => compareLastEvaluationData(a, b, true),
    fontIcon: 'arrow_downward_alt'
}

export const ALL_SORTING_OPTIONS = [CREATION_DATE_ASC, CREATION_DATE_DESC, LAST_EVALUATED_DATE_ASC, LAST_EVALUATED_DATE_DESC]

function compareLastEvaluationData(a: Website, b: Website, reverse: boolean): number {
    if (!a.last_evaluation_date && b.last_evaluation_date) {
        return 1;
    } else if (a.last_evaluation_date && !b.last_evaluation_date) {
        return -1;
    } else if (!a.last_evaluation_date && !b.last_evaluation_date) {
        return 0;
    }
    if (reverse) {
        const tmp = a;
        a = b;
        b = tmp;
    }
    return a.last_evaluation_date!.getTime() - b.last_evaluation_date!.getTime();
}
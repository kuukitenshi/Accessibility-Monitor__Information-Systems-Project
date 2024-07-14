export interface Website {
    _id : string;
    url: string;
    creation_date: Date;
    last_evaluation_date: Date | null;
    state: string;
}
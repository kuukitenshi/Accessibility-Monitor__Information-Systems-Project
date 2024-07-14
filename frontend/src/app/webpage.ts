import { Evaluation } from "./evaluation";
import { Website } from "./website";

export interface Webpage {
    _id: string;
    url: string;
    last_evaluation_date?: Date;
    state: string;
    website: Website;
    evaluation?: Evaluation;
}
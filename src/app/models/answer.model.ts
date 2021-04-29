export class Answer {
    iRevAnswerId: number;
    iRevQuestionId: number;
    nvAnswersContent: string;
    iorder: number;
    constructor(iRevAnswerId: number, iRevQuestionId: number, nvAnswersContent: string, iorder: number) {
        this.iRevAnswerId = iRevAnswerId;
        this.iRevQuestionId = iRevQuestionId;
        this.nvAnswersContent = nvAnswersContent;
        this.iorder = iorder;
    }
}

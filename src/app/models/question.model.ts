import { Answer } from "./answer.model";

export class Question {
    bEnableFile: boolean;

    bIncludeGrade: boolean;
    bRequired: boolean;
    iCorrectAnswer: number;
    iNumPercent: number;
    iProjectReviewId: number;

    iRevQuestionId: number;
    iRevProjectTypeId: number;
    nvQuestionsContent: string;
    iQuestionsType: number;
    iorder: number;
    lAnswer: Answer[];
    lProjectAnswer: [];
    constructor(bEnableFile: boolean, bIncludeGrade: boolean,
        bRequired: boolean, iCorrectAnswer: number, iNumPercent: number, iProjectReviewId: number,
        iQuestionsType: number, iRevProjectTypeId: number, iRevQuestionId: number,
        iorder: number, lAnswer: Answer[], lProjectAnswer: [], nvQuestionsContent: string
    ) {
        this.bEnableFile = bEnableFile;
        this.bIncludeGrade = bIncludeGrade;
        this.bRequired = bRequired;
        this.iCorrectAnswer = iCorrectAnswer;
        this.iNumPercent = iNumPercent;
        this.iProjectReviewId = iProjectReviewId;
        this.iQuestionsType = iQuestionsType;
        this.iRevProjectTypeId = iRevProjectTypeId;
        this.iRevQuestionId = iRevQuestionId;
        this.iorder = iorder;
        this.lAnswer = lAnswer;
        this.lProjectAnswer = lProjectAnswer;
        this.nvQuestionsContent = nvQuestionsContent;
    }


}
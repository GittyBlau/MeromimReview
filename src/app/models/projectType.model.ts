import { Question } from './question.model'

export class ProjectType { 
    iNumQuestion: number;
    iRevProjectTypeId: number;
    nvRevProjectType: string;
    iStatusType: number;
    lQuestion: Question[];
    iNumProjectReview:number;
    constructor(iNumQuestion: number,iNumProjectReview:number, iRevProjectTypeId: number, nvRevProjectType: string, iStatusType: number, lQuestion: Question[]) {
        this.iRevProjectTypeId = iRevProjectTypeId;
        this.nvRevProjectType = nvRevProjectType;
        this.iStatusType = iStatusType;
        this.lQuestion = lQuestion;
        this.iNumQuestion=iNumQuestion;
        this.iNumProjectReview=iNumProjectReview;
    }

}

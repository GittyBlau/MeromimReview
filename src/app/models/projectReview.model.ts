export class ProjectReview{
    iProjectReviewId: number;
    nvRevProjectType: string;
    iProjectId: number;
    iSiteId: number;
    nvProjectName:string;
    iOneTimeDonationId: number;
    nvOneTimeDonationName: string;
    nvSubProject: string;
    iProjectActivityArea: number;
    iRevProjectTypeId: number;
    iRevNumber: number;
    dRevDate: Date;
    iProjectReviewReason: number;
    iRevStatus: number;
    nvRevStatus: string;
    nvSiteName:string;
    nvMonitoringArea:string;
    nvReason:string;
    constructor(iProjectReviewId: number, nvRevProjectType: string, iProjectId: number, iSiteId: number,
        nvProjectName:string,iOneTimeDonationId: number,nvOneTimeDonationName: string,nvSubProject: string,
        iProjectActivityArea: number,iRevProjectTypeId: number,iRevNumber: number,dRevDate: Date,
        iProjectReviewReason: number,
        iRevStatus: number,nvRevStatus: string,nvSiteName:string,nvMonitoringArea,nvReason:string){
            this.iProjectReviewId = iProjectReviewId;
            this.nvRevProjectType = nvRevProjectType;
            this.iProjectId = iProjectId;
            this.iSiteId = iSiteId;
            this.nvProjectName = nvProjectName;
            this.iOneTimeDonationId = iOneTimeDonationId;
            this.nvOneTimeDonationName = nvOneTimeDonationName;
            this.nvSubProject = nvSubProject;
            this.iProjectActivityArea = iProjectActivityArea;
            this.iRevProjectTypeId = iRevProjectTypeId;
            this.iRevNumber = iRevNumber;
            this.dRevDate = dRevDate;
            this.iProjectReviewReason = iProjectReviewReason;
            this.iRevStatus = iRevStatus;
            this.nvRevStatus = nvRevStatus;
           this.nvSiteName=nvSiteName;
           this.nvMonitoringArea=nvMonitoringArea;
           this.nvReason;
        }

}

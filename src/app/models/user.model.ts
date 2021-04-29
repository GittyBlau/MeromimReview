

export class User{

    iPersonId: number;
    iPrivilegeTypeId: number;
    iUserId:number;
    nvFirstName:string;
    nvLastName:string;
    nvMail: string;
    nvPassword:string;
    nvUserName:string;
    constructor(iPersonId: number, iPrivilegeTypeId: number, iUserId:number, nvFirstName:string, nvLastName:string, nvMail: string, nvPassword:string, nvUserName:string){
        this.iPersonId = iPersonId;
        this.iPrivilegeTypeId = iPrivilegeTypeId;
        this.iUserId = iUserId;
        this.nvFirstName = nvFirstName;
        this.nvLastName = nvLastName;
        this.nvMail = nvMail;
        this.nvPassword = nvPassword;
        this.nvUserName = nvUserName;
    }

}
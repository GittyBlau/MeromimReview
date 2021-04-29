import { Component, OnInit ,Inject} from '@angular/core';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AppServiceService } from 'src/app/services/app-service.service';

export interface DialogData {
  functionName:string;
  name: string;
  id:string
}

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent{

  getNvUserName = window.sessionStorage.getItem("nvUserName");
  getIUserId = +window.sessionStorage.getItem("iUserId");
    constructor(private proxy: AppProxyService,
      public dialogRef: MatDialogRef<DialogDeleteComponent> 
      ,@Inject(MAT_DIALOG_DATA) public data:DialogData
      ,private service :AppServiceService )
       {
         this.service=service;
       }
     //בביטול פעולת המחיקה לא יתבצע מאומה 
    onNoClick(): void {
      this.dialogRef.close();
    }
//באישור פעולת המחיקה תמחק תבנית האופי שנבחרה
    async onOkClick(){
      if(this.data.functionName=="ProjectTypeDelete")//מחיקת אופי הפרויקט
      {
   await this.proxy.post(this.data.functionName,{iRevProjectTypeId:this.data.id,iUserId:this.getIUserId})
    .then(res=>{
      if(res==null||res==undefined)
      {
        this.proxy.openDialog("תקלה במחיקת התבנית");
      }
      else
      {

        this.proxy.openDialog("הנתונים נמחקו בהצלחה");
      
      }
    
    });
  }
  else//מחיקת פרויקט
  {
    await this.proxy.post(this.data.functionName,{iProjectReviewId:this.data.id,iUserId:this.getIUserId})
    .then(res=>{
      if(res==null||res==undefined)
      {
        this.proxy.openDialog("תקלה במחיקת הפרויקט");
      }
      else
      {

        this.proxy.openDialog("הנתונים נמחקו בהצלחה");
      
      }
    
    });
  }
    
     this.dialogRef.close();   
    }
  
  }


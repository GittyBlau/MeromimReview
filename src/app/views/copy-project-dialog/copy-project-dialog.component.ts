import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { AppServiceService } from 'src/app/services/app-service.service';

export interface copyData {
  id: string,
  dRevDate:Date
}
@Component({
  selector: 'app-copy-project-dialog',
  templateUrl: './copy-project-dialog.component.html',
  styleUrls: ['./copy-project-dialog.component.css']
})
export class CopyProjectDialogComponent implements OnInit {
  getIUserId = +window.sessionStorage.getItem("iUserId");
  constructor(private proxy: AppProxyService,
    public dialogRef: MatDialogRef<CopyProjectDialogComponent>
    , @Inject(MAT_DIALOG_DATA) public data: copyData
    , private service: AppServiceService) {
    this.service = service;
  }

  ngOnInit() {
  }
  onNoClick() {
    this.dialogRef.close();   
  }
  //בלחיצה על אישור משכפל את הביקורת שנבחרה
  async onOkClick() {
    //ProjectReviewCopy
    let dateSelected = (document.getElementsByName('dRevDate')[0] as HTMLInputElement).value;
    var date = (new Date(dateSelected));
    var dateString = '/Date(' + date.getTime() + (date+'').substring((date+'').indexOf('+'),(date+'').indexOf('+')+5) +")/";
    await this.proxy.post("ProjectReviewCopy",{iProjectReviewId:this.data.id,dRevDate:dateString, iUserId:this.getIUserId})
    .then(res=>{
      if(res==null||res==undefined)
      {
        this.proxy.openDialog("תקלה בהעתקת הפרויקט");
      }
      
    });
    this.dialogRef.close();   

  }
}

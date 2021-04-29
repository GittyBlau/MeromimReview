import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { AppServiceService } from 'src/app/services/app-service.service';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit {
  projectRevList: any;
  getNvUserName = window.sessionStorage.getItem("nvUserName");
  getIUserId = +window.sessionStorage.getItem("iUserId");
  constructor(private datePipe: DatePipe, private proxy: AppProxyService, private service: AppServiceService, private router: Router,
    public dialogRef: MatDialogRef<AddReviewComponent>) {
    this.router = router;
  }

  ngOnInit() {
    this.proxy.post("GetProjectType", { bAllProject: true }).then(
      res => {
        if (!res || res == -1 || res == undefined) {
          console.log("error, not exist");
        }
        else {
          this.projectRevList = res;
        }
      });
  }
  //הוספת ביקורת חדשה
  addProjectReview() {
    this.dialogRef.close();
    //קבלת הנתונים שהוקלדו ושליחת הפרמטרים
    let projType = this.projectRevList.find(x => x.nvRevProjectType == (document.getElementsByName('nvRevProjectType')[0] as HTMLInputElement).value);
    projType = projType ? projType.iRevProjectTypeId : null;
    let dateSelected = (document.getElementsByName('dRevDate')[0] as HTMLInputElement).value;
    var date = (new Date(dateSelected));
    var dateString = '/Date(' + date.getTime() + (date + '').substring((date + '').indexOf('+'), (date + '').indexOf('+') + 5) + ")/";

    this.proxy.post("ProjectReviewInsert", { iRevProjectTypeId: projType, iProjectId: null, iUserId: this.getIUserId, dRevDate: dateString }).then(
      res => {
        if (!res || res == -1 || res == undefined) {
          alert("error, not exist");
        }
        else {
          this.router.navigate(['Navigate/EditProject', { id: res.iProjectReviewId, isReview: true }]);
          console.log("ProjectReviewInsert: " + JSON.stringify(res));
        }
      });
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { AppServiceService } from 'src/app/services/app-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface revData {
  oReview: object;
}
@Component({
  selector: 'app-end-review',
  templateUrl: './end-review.component.html',
  styleUrls: ['./end-review.component.css']
})

export class EndReviewComponent implements OnInit {

  constructor(private proxy: AppProxyService,private router: Router,
    public dialogRef: MatDialogRef<EndReviewComponent>
    , @Inject(MAT_DIALOG_DATA) public data: revData
    , private service: AppServiceService) {
    this.service = service;
  }

  ngOnInit() {
  }
  onOkClick() {
    this.data.oReview['iRevStatus'] = (document.getElementsByName("status")[0] as HTMLFormElement).checked ? "1176" : "1177";
    this.proxy.post("ProjectAnswerInsertUpdate", this.data.oReview)
      .then(res => {
        if (!res || res == -1) {
          this.proxy.openDialog("בעיה בקליטת נתונים");
        }
        else {
          this.proxy.openDialog("הנתונים נשמרו בהצלחה!");
          this.router.navigate(['Navigate/ProjectReview']);
          this.dialogRef.close();
        }
      });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

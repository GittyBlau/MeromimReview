import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCALE_TEXT } from 'src/app/addition/constant';
import { ProjectReview } from 'src/app/models/projectReview.model';
import { DateParsePipe } from 'src/app/pipes/date-parse.pipe';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { AppServiceService } from 'src/app/services/app-service.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  getNvUserName = window.sessionStorage.getItem("nvUserName");
  getIUserId = +window.sessionStorage.getItem("iUserId");
  projectRevList: [];
  projectTypeList: any;
  f: boolean = false;
  columnDefs = [];
  rowData = [];
  reasonList: any;
  statusList: any;
  constructor(private dateParse: DateParsePipe, private datePipe: DatePipe, private route: ActivatedRoute, private proxy: AppProxyService, private service: AppServiceService, private router: Router, public dialog: MatDialog) {
    this.proxy = proxy;
    this.service = service;
    this.dialog = dialog;
    this.dateParse = dateParse;
  }
  public gridOptions;
  ngOnInit() {
    this.gridOptions = {
      defaultColDef: {
        cellStyle: { textAlign: "right" },
        resizable: true
      },
      rowData: this.rowData,
      columnDefs: this.columnDefs,
      localeText: LOCALE_TEXT,
      context: { componentParent: this },
      enableRtl: true
    }
    this.getList();
  }
  gridApi: any;
  //בנתונים gridApi מסדר את התצוגה של הטבלה לאחר טעינת הנתונים ומאתחל את המשתנה
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    // console.log(params);
  }
  // פונקציה המאפשרת להגדיל ולהקטין עמודות בטבלה ומיישרת ומאזנת את הגודל
  onColumnResized(params) {
    if (params.source === 'uiColumnDragged' && params.finished) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  //לעבור לעמוד הצגת התוצאה הספציפית שנבחרה
  resultsFunc(params) {
    this.router.navigate(['Navigate/Answers', { id: params.iProjectReviewId, isResult: true }]);
  }
  //בניית הטבלה להצגת הנתונים כך שכל תוצאה תוצג בשורה נפרדת  
  //בנוסף עמודות אקטיביות עם כפתורים  
  tableBuild() {
    this.columnDefs = [
      {
        headerName: 'תוצאות', field: 'results', width: 100, filter: false,
        cellRenderer: function (params) {
          var eDiv = document.createElement("div");
          eDiv.innerHTML = `<img style=" background: none; border: none; cursor: pointer" id="results" width="25px" src="../../../assets/test-partial-passed.png">`;
          var eImg = eDiv.querySelectorAll('#results')[0];
          eImg.addEventListener('click', function () {
            params.context.componentParent.resultsFunc(params.data);
          });
          return eDiv;
        }
      },
      { headerName: 'אופי הפרויקט', field: 'iRevProjectTypeId', filter: 'agTextColumnFilter', width: 110 },
      { headerName: 'שם הפרויקט', field: 'nvProjectName', filter: 'agTextColumnFilter', width: 110 },
      { headerName: 'כתובת', field: 'nvMonitoringArea', filter: 'agTextColumnFilter', width: 110 },
      { headerName: 'תאריך ביקורת', field: 'dRevDate', filter: 'agTextColumnFilter', width: 110 },
      { headerName: 'סטטוס', field: 'iRevStatus', filter: 'agTextColumnFilter', width: 110 },
    ]
  }
  //ממלא את הנתונים בטבלה
  rows() {
    if (!this.f) {
      // אם מגיע לפונקציה בעת הטעינה הראשונה יגדיר את העמודות בטבלה
      // אך אם רק צריך לרענן נתונים לאחר פעולה מסוימת ידלג על הפונקציה  
      this.tableBuild();
      this.f = true;
    }
    //לעדכון השורות מחדש 
    this.rowData = [];
    this.projectRevList.forEach(element => {
      let iProjectReviewReason = this.reasonList.find(x => x.Key == (element as ProjectReview).iProjectReviewReason);
      iProjectReviewReason = iProjectReviewReason == null ? null : iProjectReviewReason.Value;
      let iRevStatus = this.statusList.find(x => x.Key == (element as ProjectReview).iRevStatus);
      iRevStatus = iRevStatus == null ? null : iRevStatus.Value;
      let projectType = this.projectTypeList.find(x => x.iRevProjectTypeId == (element as ProjectReview).iRevProjectTypeId);
      projectType = (projectType != null) ? projectType.nvRevProjectType : null;
      var dateString: Date = ((element as ProjectReview).dRevDate);
      var dateP=dateString? this.datePipe.transform(this.dateParse.transform(dateString), 'shortDate'):null;
      this.rowData.push(new Object(
        {
          iProjectReviewId: (element as ProjectReview).iProjectReviewId,
          iRevProjectTypeId: projectType,
          nvProjectName: (element as ProjectReview).nvProjectName,
          nvSiteName: (element as ProjectReview).nvSiteName,
          nvMonitoringArea: (element as ProjectReview).nvMonitoringArea,
          iRevNumber: (element as ProjectReview).iRevNumber,
          iProjectReviewReason: iProjectReviewReason,
          dRevDate: dateP,
          iRevStatus: iRevStatus,
          nvReason: (element as ProjectReview).nvReason
        }
      ));
    });

  }
  //מקבל את כל רשימות הנתונים שצריך מהשרת
  async getList() {
      await this.proxy.post("GetProjectReview",
       { "bFinished": true, "dFromDate": null, "dToDate": null, "iUserId": this.getIUserId })
       .then(
      res => {
        if (!res || res == -1 || res == undefined) {
          console.log("error, not exist");
        }
        else {
          this.projectRevList = res;
          console.log('projectRevList: '+JSON.stringify(this.projectRevList,null ,4) )
          this.proxy.post("SysTableContentGet", { "iSysTableId": 27 }).then(
            res => {
              if (!res || res == -1 || res == undefined) {
                console.log("error, not exist");
              }
              else {
                this.statusList = res;
                this.proxy.post("SysTableContentGet", { "iSysTableId": 29 }
                ).then(
                  res => {
                    if (!res || res == -1 || res == undefined) {
                      console.log("error, not exist");
                    }
                    else {
                      this.reasonList = res;
                      this.proxy.post("GetProjectType", {}
                      ).then(
                        res => {
                          if (!res || res == -1 || res == undefined) {
                            console.log("error, not exist");
                          }
                          else {
                            this.projectTypeList = res;
                            this.proxy.post("SysTableContentGet", { "iSysTableId": 18 }
                            ).then(
                              res => {
                                if (!res || res == -1 || res == undefined) {
                                  console.log("error, not exist");
                                }
                                else {
                                  this.rows();
                                }
                              });
                          }
                        });
                    }
                  });
              }
            });
        }
      });
  }
  //פונקציה להצגת הערות בחלון 
  openDialog(str) {
    this.proxy.openDialog(str);
  }
}

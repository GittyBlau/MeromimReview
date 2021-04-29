import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import { MatDialog, MatSort } from '@angular/material'
// import { GridOptions } from "ag-grid-community";
import { ProjectReview } from 'src/app/models/projectReview.model';
import { AppServiceService } from 'src/app/services/app-service.service';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { Router } from '@angular/router';
import { LOCALE_TEXT } from 'src/app/addision/constant';
import { from } from 'rxjs';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { CopyProjectDialogComponent } from '../copy-project-dialog/copy-project-dialog.component';
import { DatePipe } from '@angular/common';
import { DateParsePipe } from 'src/app/Pipes/date-parse.pipe';
import { AddReviewComponent } from '../add-review/add-review.component';

@Component({
  selector: 'app-project-review',
  templateUrl: './project-review.component.html',
  styleUrls: ['./project-review.component.css']
})
//עמוד הצגת כל הביקורות
export class ProjectReviewComponent implements OnInit {
  getNvUserName = window.sessionStorage.getItem("nvUserName");
  getIUserId = +window.sessionStorage.getItem("iUserId");
  projectRevList = new Array<Object>();
  projectTypeList = [];
  reasonList = [];
  statusList = [];
  columnDefs = [];
  rowData = [];
  f = false;
  public gridOptions;
  gridApi: any;

  constructor(private datePipe: DatePipe, private dateParse: DateParsePipe, private proxy: AppProxyService, private service: AppServiceService, private router: Router, public dialog: MatDialog) {
    this.proxy = proxy;
    this.service = service;
    this.dialog = dialog;
    this.dateParse = dateParse;

    var getNvUserName = window.sessionStorage.getItem("nvUserName");
    var getIUserId = window.sessionStorage.getItem("iUserId");
    console.log("getnvUserName " + getNvUserName, "iUserId " + (getIUserId));


  }
  ngOnInit() {
    this.setGridOptions();
    this.getList();
  }
  //בנתונים gridApi מסדר את התצוגה של הטבלה לאחר טעינת הנתונים ומאתחל את המשתנה
  onGridReady(params) {
    this.gridApi = params.api;
    this.autoSizeAll(false);
    this.gridApi.sizeColumnsToFit();
  }

  //בניית הטבלה להצגת הנתונים כך שכל ביקורת תוצג בשורה נפרדת  
  //בנוסף עמודות אקטיביות עם כפתורים לעריכת הביקורת
  tableBuild() {
    this.columnDefs = [
      { headerName: 'אופי הפרויקט', field: 'iRevProjectTypeId', filter: 'agTextColumnFilter'},
      { headerName: 'שם הפרויקט', field: 'nvProjectName', filter: 'agTextColumnFilter', type: 'rightAligned' },
      { headerName: 'אזור', field: 'nvMonitoringArea', filter: 'agTextColumnFilter', columnGroupShow: false,width:100, type: 'rightAligned' },
      { headerName: 'תאריך ביקורת', field: 'dRevDate', filter: 'agTextColumnFilter' ,width:50, type: 'rightAligned'},
      { headerName: 'סטטוס', field: 'iRevStatus', filter: 'agTextColumnFilter', type: 'rightAligned' },
      {
        headerName: 'מחק', field: 'delete',
        cellRenderer: function (params) {
          var eDiv = document.createElement("div");
          eDiv.innerHTML = `<img style=" background: none; border: none; cursor: pointer" id="delete" width="25px" src="../../../assets/delete-forever.png">`;
          var eImg = eDiv.querySelectorAll('#delete')[0];
          eImg.addEventListener('click', function () {
            params.context.componentParent.openDialogDel(params.data);
          });
          return eDiv;
        }
      },
      {
        headerName: 'שכפל', field: 'copy',
        cellRenderer: function (params) {
          var eDiv = document.createElement("div");
          eDiv.innerHTML = `<img style=" background: none; border: none; cursor: pointer" id="copy"  width="25px" src="../../../assets/copy.png">`;
          var eImg = eDiv.querySelectorAll('#copy')[0];
          eImg.addEventListener('click', function () {
            // console.log("params.data: " + params.data + " params " + params);
            params.context.componentParent.openDialogCopy(params.data);
          });
          return eDiv;
        }
      },
      // { headerName: 'מזהה ביקורת', field: 'iProjectReviewId', filter: 'agNumberColumnFilter', sortable: true },
      {
        headerName: 'עריכה', field: 'edit',
        cellRenderer: function (params) {
          var eDiv = document.createElement("div");
          if (params.data.iRevStatus != "לא בוצע")
            eDiv.innerHTML = `<button id="edit" disabled style=" cursor: pointer; opacity:40%;background: none; border: none;"><img width="25px" src="../../../assets/edit (1).png"></button>`;
          else
            eDiv.innerHTML = `<img id="edit" style=" cursor: pointer" width="25px" src="../../../assets/edit (1).png">`;
          var eImg = eDiv.querySelectorAll('#edit')[0];
          eImg.addEventListener('click', function () {
            // params.context.componentParent.openDialog(params.data.iProjectReviewId);
            params.context.componentParent.EditRev(params.data.iProjectReviewId);
          });
          return eDiv;
        }
      },
      {
        headerName: 'מענה', field: 'answer',
        cellRenderer: function (params) {
          var eDiv = document.createElement("div");
          if (params.data.iProjectId)
            eDiv.innerHTML = `<img style=" background: none; border: none; cursor: pointer" id="answer" width="25px" src="../../../assets/answer1.png">`;
          else
            eDiv.innerHTML = `<button disabled style=" background: none; border: none; cursor: pointer; opacity:40%;" id="answer"><img   width="25px" src="../../../assets/answer1.png"></button>`;
          var eImg = eDiv.querySelectorAll('#answer')[0];
          eImg.addEventListener('click', function () {
            params.context.componentParent.answerProject(params.data);
          });
          return eDiv;
        }
      }
    ];
  }
  // בלחיצה על סמל מענה פרויקט בטבלה עובר לדף המענה
  answerProject(params) {
    var isRes = false;
    if (params.iRevStatus == 'עבר' || params.iRevStatus == 'נכשל' || params.iRevStatus == 'בוצע') {
      isRes = true;
    }

    this.router.navigate(['Navigate/Answers', { id: params.iProjectReviewId, isResult: isRes }])
  }
  //ממלא את הנתונים בטבלה
  rows() {

    if (!this.f) {
      // אם מגיע לפונקציה בעת הטעינה הראשונה יגדיר את העמודות בטבלה
      // אך אם רק צריך לרענן נתונים לאחר פעולה מסוימת ידלג על ההגדרות 
      this.tableBuild();
      this.f = true;
    }
    // לעדכון השורות מאפס את המשתנה 
    this.rowData = [];
    //עובר על השדות של כל הביקורות
    this.projectRevList.forEach(element => {
      let iProjectReviewReason = this.reasonList.find(x => x.Key == (element as ProjectReview).iProjectReviewReason);
      iProjectReviewReason = iProjectReviewReason == null ? null : iProjectReviewReason.Value;
      let iRevStatus = this.statusList.find(x => x.Key == (element as ProjectReview).iRevStatus);
      iRevStatus = iRevStatus == null ? null : iRevStatus.Value;
      let projectType = this.projectTypeList.find(x => x.iRevProjectTypeId == (element as ProjectReview).iRevProjectTypeId);
      projectType = projectType ? projectType.nvRevProjectType : null;
      var dateString: Date = ((element as ProjectReview).dRevDate);
      var dateP = dateString ? this.datePipe.transform(this.dateParse.transform(dateString), 'shortDate') : null;
      this.rowData.push(new Object(
        {
          iProjectId: ((element as ProjectReview).iProjectId),
          iProjectReviewId: ((element as ProjectReview).iProjectReviewId),
          iRevProjectTypeId: projectType,
          nvProjectName: (element as ProjectReview).nvProjectName,
          nvSiteName: (element as ProjectReview).nvSiteName,
          nvMonitoringArea: (element as ProjectReview).nvMonitoringArea,
          projectOrDonation: 'פרויקט',
          iProjectReviewReason: iProjectReviewReason,
          iRevNumber: (element as ProjectReview).iRevNumber,
          dRevDate: dateP,
          nextReview: null,
          iRevStatus: iRevStatus
        }
      ));
    });

    this.setGridOptions();
    // console.log('row data:' + JSON.stringify(this.rowData));
  }
  // מארגן את העמודות בטבלה שיהיו מסודרות
  autoSizeAll(skipHeader) {
    var allColumnIds = [];
    this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  //הפונקציה עורכת את ההגדרות של הטבלה 
  setGridOptions() {
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
  }
  // פונקציה המאפשרת להגדיל ולהקטין עמודות בטבלה ומיישרת ומאזנת את הגודל
  onColumnResized(params) {
    if (params.source === 'uiColumnDragged' && params.finished) {
      this.gridApi.sizeColumnsToFit();
    }
  }
  //פונקציה להצגת הודעות בחלון מיוחד
  openDialog(str) {
    this.proxy.openDialog(str);
  }
  //עריכת ביקורת לאחר לחיצה על סמל עריכה טבלה מפנה לדף מיוחד
  EditRev(id) {
    this.router.navigate(['Navigate/EditProject', { id: id, isReview: true }]);
  }
  //פונקציה לשכפול ביקורת גם כן לאחר לחיצה על הסמל בשורה של הביקורת הנוכחית
  async openDialogCopy(copyData) {
    const dialogRef = await this.dialog.open(CopyProjectDialogComponent, {
      height: '250px',
      width: '400px',
      data: { id: copyData.iProjectReviewId, dRevDate: copyData.dRevDate }
    });
    dialogRef.afterClosed().subscribe(() => {
      //עדכון השורות בטבלה
      this.getList();
    });
  }
  //פותח אפשרות למחיקת הביקורת אותה בחרו
  async openDialogDel(delData) {
    // console.log("delData: " + JSON.stringify(delData));
    // this.proxy.idDelete = (delData as ProjectType).iRevProjectTypeId;
    const dialogRef = await this.dialog.open(DialogDeleteComponent, {
      height: '200px',
      width: '400px',
      data: { functionName: "ProjectReviewDelete", name: delData.nvProjectName, id: delData.iProjectReviewId }
    });
    //עידכון השורות בטבלה לאחר המחיקה
    dialogRef.afterClosed().subscribe(() => {
      this.getList();
    });
  }

  async addProjectReview() {
    await this.dialog.open(AddReviewComponent, {
      height: '470px',
      width: '500px',
      data: {}
    });
    this.rows();
  }
  //הפונקציות הבאות מקבלות את הנתונים הנדרשים מהשרת
  async getList() {
    //הפונקציה מקבלת את רשימת הביקורות 
    await this.proxy.post("GetProjectReview", { bFinished: false, dFromDate: null, dToDate: null, iUserId: this.getIUserId }).then(
      res => {
        if (!res || res == -1 || res == undefined) {
          console.log("error, not exist");
        }
        else {
          this.projectRevList = res;
          //     console.log("GetProjectReview: " + JSON.stringify(this.projectRevList, null, 4));
          //הפונקציה מקבלת את פרטי סטטוס הביקורת -שם, מזהה וכו
          this.proxy.post("SysTableContentGet", { "iSysTableId": 27 }).then(
            res => {
              if (!res || res == -1 || res == undefined) {
                console.log("error, not exist");
              }
              else {
                this.statusList = res;
                // console.log("SysTableContentGet: iSysTableId:27: status" + JSON.stringify(res));
                //הפונקציה מקבלת את פרטי סיבת הביקורת -שם, מזהה וכו
                this.proxy.post("SysTableContentGet", { "iSysTableId": 29 }
                ).then(
                  res => {
                    if (!res || res == -1 || res == undefined) {
                      console.log("error, not exist");
                    }
                    else {
                      this.reasonList = res;
                      // console.log("SysTableContentGet: iSysTableId:29:reason " + JSON.stringify(res));
                      //הפונקציה הזו מקבלת את רשימת תבניות אופי
                      this.proxy.post("GetProjectType", {}
                      ).then(
                        res => {
                          if (!res || res == -1 || res == undefined) {
                            console.log("error, not exist");
                          }
                          else {
                            this.projectTypeList = res;
                            // console.log("GetProjectType: " + JSON.stringify(res));
                            //מקבלת את רשימת האזורים הקיימים
                            this.proxy.post("SysTableContentGet", { "iSysTableId": 18 }
                            ).then(
                              res => {
                                if (!res || res == -1 || res == undefined) {
                                  console.log("error, not exist");
                                }
                                else {
                                  // console.log("אזורים: " + JSON.stringify(res));
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

}


import { Component, EmbeddedViewRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { AppServiceService } from 'src/app/services/app-service.service';
import { ProjectType } from 'src/app/models/projectType.model';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { LOCALE_TEXT } from 'src/app/addision/constant';
import { Router } from '@angular/router';
import { AbsoluteSourceSpan } from '@angular/compiler';


@Component({
  selector: 'app-project-type',
  templateUrl: './project-type.component.html',
  styleUrls: ['./project-type.component.css']
})
export class ProjectTypeComponent implements OnInit {

  constructor(public proxy: AppProxyService, private router: Router, private service: AppServiceService, public dialog: MatDialog) {
    this.proxy = proxy;
    this.service = service;
    this.dialog = dialog;
    this.router = router;
  }
  public gridOptions;
  public columnDefs = [];
  gridApi: any;
  ngOnInit() {
    this.gridOptions = {
      defaultColDef: {
        cellStyle: { textAlign: "right" },
        resizable: true
      },
      localeText: LOCALE_TEXT,
      context: { componentParent: this },
      enableRtl: true
    }
    this.GetProjectType();
  }
  //בנתונים gridApi מסדר את התצוגה של הטבלה לאחר טעינת הנתונים ומאתחל את המשתנה
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    console.log(params);
  }
  //   פונקציה המאפשרת להגדיל ולהקטין עמודות בטבלה ומיישרת ומאזנת את הגודל
  onColumnResized(params) {
    if (params.source === 'uiColumnDragged' && params.finished) {
      this.gridApi.sizeColumnsToFit();
    }
  }
  //בניית הטבלה להצגת הנתונים כך שכל תבנית אופי תוצג בשורה נפרדת  
  //בנוסף עמודות אקטיביות עם כפתורים לעריכת תבנית
  tableBuild() {
    this.columnDefs = [
      { headerName: 'אופי פרויקט', field: 'projectType', filter: 'agTextColumnFilter', width: 70 },
      { headerName: 'מספר שאלות', field: 'numOfQuest', filter: 'agNumberColumnFilter', width: 70 },
      // { headerName: 'מזהה', field: 'iRevProjectTypeId',resizable:"true", filter: 'agNumberColumnFilter', width: 150 },
      {
        headerName: 'עריכה', field: 'edit', width: 50,
        cellRenderer: function (params) {
          var eDiv = document.createElement("div");
          eDiv.innerHTML = `<img style=" cursor: pointer" id="edit" width="25px" src="../../../assets/edit (1).png">`;
          var eImg = eDiv.querySelectorAll('#edit')[0];
          eImg.addEventListener('click', function () {
            params.context.componentParent.editFunc(params.data.iRevProjectTypeId);
          });
          return eDiv;
        }
      },
      {
        headerName: 'מחיקה', field: 'delete', width: 50,
        cellRenderer: function (params) {
          var eDiv = document.createElement("div");
          if (params.context.componentParent.projectList.find(x => x.iRevProjectTypeId == params.data.iRevProjectTypeId).iNumProjectReview > 0 == true)
            eDiv.innerHTML = `<button disabled class="btn.disabled btn-default.disabled" style="opacity:40%; background: none; border: none; cursor: pointer" id="delete"><img  width="25px" src="../../../assets/delete-forever.png"></button>`;
          else
            eDiv.innerHTML = `<button  style=" background: none; border: none; cursor: pointer" id="delete"><img  width="25px" src="../../../assets/delete-forever.png"></button>`;

          var eImg = eDiv.querySelectorAll('#delete')[0];
          eImg.addEventListener('click', function () {
            params.context.componentParent.openDialogDel(params.data);
          });
          return eDiv;
        }
      }
    ];
  }
  rowData = [];
  async openDialogDel(delData) {
    // console.log("delData: " + JSON.stringify(delData));
    const dialogRef = await this.dialog.open(DialogDeleteComponent, {
      height: '200px',
      width: '400px',
      data: { functionName: "ProjectTypeDelete", name: delData.projectType, id: delData.iRevProjectTypeId }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.GetProjectType();
    });
  }
  projectList = new Array<any>();
  editFunc(id) {
    var obj;
    this.router.navigate(['Navigate/EditProject', { id: id, isReview: false }]);

  }
  f: boolean = false;
  //ממלא את הנתונים בטבלה
  rows() {
    if (!this.f) {
      // אם מגיע לפונקציה בעת הטעינה הראשונה יגדיר את העמודות בטבלה
      // אך אם רק צריך לרענן נתונים לאחר פעולה מסוימת ידלג על הפונקציה  
      this.tableBuild();
      this.f = true;
    }
    // לעדכון השורות מחדש מאפס את המשתנה 
    this.rowData = [];
    //עובר על השדות של כל התבניות
    this.projectList.forEach(element => {
      this.rowData.push(new Object(
        {
          numOfQuest: (element as ProjectType).iNumQuestion,
          projectType: (element as ProjectType).nvRevProjectType,
          iRevProjectTypeId: (element as ProjectType).iRevProjectTypeId
        }
      ));
    });
    // console.log("rowData (rows function): " + JSON.stringify(this.rowData));
  }
  addProjectType() {
    this.router.navigate(['Navigate/EditProject', { id: -1, isReview: false }]);

  }
  defFixedQuestion() {
    //this.router.navigate(['Navigate/FixedQuestions']);
    this.router.navigate(['Navigate/EditProject', { id: 0, isReview: false }]);

  }

  defSuccessFeedback() {
    this.proxy.post("FeedbackGet", { nvFile: "FeedbackSuccess" }).then(
      res => {
        if (!res || res == -1 || res == undefined) {
          console.log("error, not exist");
        }
        else {
          console.log("FeedbackGet: " + JSON.stringify(res));
          var div = document.getElementById("feedBack");
          div ? (div as HTMLElement).innerHTML = (res) : null;
          // (div as HTMLElement).innerHTML.replace('[שם_פרויקט]','שם פרויקט?');
        }
      });
  }
  
  //מקבל מהשרת את רשימת תבניות האופי
  async GetProjectType() {
    await this.proxy.post("GetProjectType", { bAllProject: true }).then(
      res => {
        if (!res || res == -1 || res == undefined) {
          console.log("error, not exist");
        }
        else {
          this.projectList = res;
          //     console.log(JSON.stringify(this.projectList)); 
        }
      });
    //קורא לעדכון הנתונים בטבלה
    this.rows();

  }

}

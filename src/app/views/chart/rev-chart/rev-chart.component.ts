import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectReview } from 'src/app/models/projectReview.model';
import { DateParsePipe } from 'src/app/pipes/date-parse.pipe';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { AppServiceService } from 'src/app/services/app-service.service';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-rev-chart',
  templateUrl: './rev-chart.component.html',
  styleUrls: ['./rev-chart.component.css']
})
export class RevChartComponent implements OnInit {
  projectRevList: Array<object>;
  singleProjectRevs: Array<object>;
  year: Number = 2021;
  getNvUserName = window.sessionStorage.getItem("nvUserName");
  getIUserId = +window.sessionStorage.getItem("iUserId");
  public selected;
  constructor(private chartObj: ChartComponent, private dateParse: DateParsePipe, private datePipe: DatePipe,
    private route: ActivatedRoute, private proxy: AppProxyService,
    private service: AppServiceService, private router: Router, public dialog: MatDialog) {
    this.proxy = proxy;
    this.service = service;
    this.dialog = dialog;
    this.dateParse = dateParse;
    this.chartObj = chartObj;
    // if (!this.service.currentUser) {
    //   this.router.navigate(['']);
    // }

    this.getReview();
    this.reviewsInfo = [
      { 'name': 'דצמבר', 'grades': 0, 'quantity': 0 },
      { 'name': 'נובמבר', 'grades': 0, 'quantity': 0 },
      { 'name': 'אוקטובר', 'grades': 0, 'quantity': 0 },
      { 'name': 'ספטמבר', 'grades': 0, 'quantity': 0 },
      { 'name': 'אוגוסט', 'grades': 0, 'quantity': 0 },
      { 'name': 'יולי', 'grades': 0, 'quantity': 0 },
      { 'name': 'יוני', 'grades': 0, 'quantity': 0 },
      { 'name': 'מאי', 'grades': 0, 'quantity': 0 },
      { 'name': 'אפריל ', 'grades': 0, 'quantity': 0 },
      { 'name': 'מרץ', 'grades': 0, 'quantity': 0 },
      { 'name': 'פברואר', 'grades': 0, 'quantity': 0 },
      { 'name': 'ינואר', 'grades': 0, 'quantity': 0 },
    ];

    //Metadata for the chart like width and height of the chart, Title for the chart, Title color etc..
    this.metaInfo = {
      'chartWidth': '1200',
      'chartHeight': '500',
      'title': ' מצב הצלחת הביקורות באחוזים במשך כל השנה ',
      'titleColor': '#78D64B',
      'titleFont': '20px sans-serif',
      'columnTitleColor': '#78D64B',
      'columnFont': '12px sans-serif',
      'footerTitle': 'חדשים',
      'footerColor': '#78D64B',
      'footerFont': '12px sans-serif',
      'leftaxisColor': '#78D64B',
      'leftaxisFont': '12px sans-serif',
    }
  }
  ngOnInit() {
  }
  reviewsInfo;
  //meta Info object holds lot of properties describes the title and color and othe meta info for chart
  metaInfo;
  //iProjectId//כדי להפריד כל פרויקט בנפרד
  //nvProjectName//בשביל להציג למעלה
  changeSelect(event) {
    var project = this.service.projectDiagram;
    if (event && event != 1) {
      this.service.projectDiagram = event.value;
      project = event.value;
    }
    if (!event)
      project = (this.projectRevList[0] as ProjectReview).nvProjectName;
    for (let i = 0; i < this.reviewsInfo.length; i++) {
      this.reviewsInfo[i]['grades'] = 0;
      this.reviewsInfo[i]['quantity'] = 0;

    }

    this.singleProjectRevs = this.projectRevList.filter(x => (x as ProjectReview).nvProjectName == project);
    console.log(JSON.stringify(this.singleProjectRevs));

    for (let i = 0; i < this.singleProjectRevs.length; i++) {
      var dateString: Date = ((this.singleProjectRevs[i] as ProjectReview).dRevDate);
      if (dateString) {
        let simpleDate = this.dateParse.transform(dateString);
        if (this.year == simpleDate.getFullYear()) {
          let month = 11 - simpleDate.getMonth();
          this.reviewsInfo[month]['grades'] += this.singleProjectRevs[i]["iPercentGrade"];
          this.reviewsInfo[month]['quantity']++;
        }
      }
    }

    for (let i = 0; i < this.reviewsInfo.length; i++) {
      if (this.reviewsInfo[i]['quantity'] > 1)
        this.reviewsInfo[i]['grades'] = this.reviewsInfo[i]['grades'] / this.reviewsInfo[i]['quantity'];
    }

    this.service.chartObj.chartMetaInfo = this.metaInfo;
    this.service.chartObj.chartData = this.reviewsInfo;
    this.service.chartObj.ngOnInit();


  }
  revListFilter=[];
  getReview() {
    this.proxy.post("GetProjectReview", { bFinished: true, dFromDate: null, dToDate: null, iUserId: this.getIUserId }).then(
      res => {
        if (!res || res == -1 || res == undefined) {
          console.log("error, not exist");
        }
        else {

          this.projectRevList = res;
          this.projectRevList.forEach(element => {
 var p=this.revListFilter.filter(x=>x.iProjectId==(element as ProjectReview).iProjectId);
   if(p.length==0)
   {
     this.revListFilter.push(element);
   }
       });
       this.selected=this.revListFilter[0];

          this.changeSelect(null);
        }
      });
  }
}

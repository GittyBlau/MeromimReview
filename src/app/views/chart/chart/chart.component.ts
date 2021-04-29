import { Component, Input, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/services/app-service.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() chartData;
  //getting the chart Meta data
  @Input() chartMetaInfo;

  constructor(private service: AppServiceService) { }

  ngOnInit() {
    if (!this.service.chartObj) {
      this.service.chartObj = this;
    }
    //setting up the inital Context, Get the canvas element
    const canvas = <HTMLCanvasElement>document.getElementById('chart');
    // getContext will return the rendering context using it we can call the different methods and properties for creating shapes
    //we will be sending this context throught the methods to implement any drawing
    const context = canvas.getContext('2d');
    //To set up the inital background color for the drawing area  
    context.fillStyle = '#F7F7F7';
    console.log(this.chartMetaInfo);
    //fillRect will use the fillstyle color and starts from 0,0 position and draws a rectangle with the width and height provided in
    //metadata , This will set up the context will #262a33 backgound , on top of this we will start drawing.
    context.fillRect(0, 0, this.chartMetaInfo.chartWidth, this.chartMetaInfo.chartHeight);
    //The below 4 functions , contain the logic of drawing the chart I will be explaining them in Steps sections  
    this.addTitleToChart(context);
    this.addFooterToChart(context);
    this.addHorizontalLines(context);
    this.drawBarChart(context);

  }

  addTitleToChart(context) {
    context.font = this.chartMetaInfo.titleFont;
    context.fillStyle = this.chartMetaInfo.titleColor;
    context.fillText(this.chartMetaInfo.title, 1170, 30);
  }

  addFooterToChart(context) {
    context.font = this.chartMetaInfo.titleFont;
    context.fillStyle = this.chartMetaInfo.footerColor;
    context.fillText(this.chartMetaInfo.footerTitle, this.chartMetaInfo.chartWidth -30, this.chartMetaInfo.chartHeight - 10);
  }

  addColumnName(context, name, xpos, ypos) {
    context.font = this.chartMetaInfo.columnFont;
    context.fillStyle = this.chartMetaInfo.columnTitleColor;
    context.fillText(name, xpos, ypos);
  }

  addHorizontalLines(context) {
    context.font = this.chartMetaInfo.leftaxisFont;
    context.fillStyle = this.chartMetaInfo.leftaxisColor;

    for (var i = 0; i < 21; i++) {

      context.lineWidth = 0.5;
      context.beginPath();
      context.moveTo(25, (20 * i) + 40);
      context.lineTo(1170, (20 * i) + 40);
      context.strokeStyle = this.chartMetaInfo.leftaxisColor;
      context.stroke();
    }
  }

  addColumnHead(context, name, xpos, ypos) {
    context.font = this.chartMetaInfo.columnFont;
    context.fillStyle = this.chartMetaInfo.columnTitleColor;
    context.fillText(name, xpos, ypos);
  }



  drawBarChart(context) {
    for (let grade = 0; grade < this.chartData.length; grade++) {
      let gradeInfo = this.chartData[grade];
      for (let j = 1; j <= gradeInfo['grades'] * 2; j = j + 10) {
        (
          (th, ind) => {
            setTimeout(function () {
              if (ind + 10 >= gradeInfo['grades'] * 2) {
                context.fillRect(25 + grade * 100, th.chartMetaInfo.chartHeight - 60, 50, -ind - 10);
              }
              context.fillStyle = "#f0712f";
              context.fillRect(25 + grade * 100, th.chartMetaInfo.chartHeight - 60, 50, -ind);
            }, 500 + (5 * ind));
          })(this, j);
      }
      this.addColumnName(context, gradeInfo.name, 63 + grade * 100, this.chartMetaInfo.chartHeight - 40);
      this.addColumnHead(context,Math.round(gradeInfo['grades'] as number), 60 + grade * 100, this.chartMetaInfo.chartHeight - gradeInfo['grades'] * 2 - 65);
    }

  }

}

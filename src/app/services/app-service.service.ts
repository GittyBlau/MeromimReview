import { Injectable } from '@angular/core';
import { ProjectReview } from '../models/projectReview.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { AppProxyService } from './app-proxy.service';
import { ChartComponent } from '../views/chart/chart/chart.component';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  currentUser :User;
  lProjectReview : ProjectReview[];
  chartObj:ChartComponent=null;
  projectDiagram='';
  constructor(public router : Router, private proxy: AppProxyService){
    this.proxy=proxy;
    this.router=router;
  }
}

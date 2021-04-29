import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { AppServiceService } from 'src/app/services/app-service.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  isReview:Boolean;
  id:number;
  constructor(private router: Router, private route: ActivatedRoute,private service:AppServiceService,  private proxy: AppProxyService) {}
  //העמוד מעביר לעריכת ביקורת או עריכת תבנית אופי לפי הפרמטר שנשלח
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id=+params['id'];
      this.isReview=params['isReview'] == 'true' ? true : false;
    });
  }


}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from 'src/app/services/app-service.service';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
//עמוד זה הוא העמוד הראשי 
export class NavigateComponent implements OnInit {
  currentUser='';
  f:false;
  getNvUserName = window.sessionStorage.getItem("nvUserName");
  getIUserId = +window.sessionStorage.getItem("iUserId");
  constructor(private service :AppServiceService,private router: Router ) { 
    this.service=service;
    this.router=router;
  }
picColor=false;

  ngOnInit() {

  }

}

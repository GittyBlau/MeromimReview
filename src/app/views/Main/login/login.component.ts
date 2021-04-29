import { Component, OnInit } from '@angular/core';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { AppServiceService } from 'src/app/services/app-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private router: Router ,private proxy:AppProxyService,private service :AppServiceService) {
    this.router=router;
    this.proxy=proxy;
    this.service=service;
   }

  ngOnInit() {
  }
  userName: string = null;
  password: string = null;
  public Login (){
    this.proxy.post("UserLogin",{nvUserName:this.userName,nvPassword:this.password})
    .then(res=>{
      if(!res.iUserId||res.iUserId==-1)
      {      
          this.proxy.openDialog("שם משתמש או סיסמא אינם תקינים");
       
      }
      else
      {
        console.log(JSON.stringify(res));
        this.service.currentUser=res;
        var setNvUserName= window.sessionStorage.setItem("nvUserName",this.service.currentUser.nvUserName);
        var setIUserId = window.sessionStorage.setItem("iUserId",String(this.service.currentUser.iUserId));
        // var getNvUserName = window.sessionStorage.getItem("nvUserName");
        // var getIUserId = window.sessionStorage.getItem("iUserId");
        // console.log("getnvUserName "+getNvUserName,"iUserId "+(getIUserId));
        this.router.navigate(['Navigate/ProjectReview']);
      }
    
    })
    };
}

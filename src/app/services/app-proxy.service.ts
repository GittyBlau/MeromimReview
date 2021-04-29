import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActionsResultDialogComponent } from '../views/actions-result-dialog/actions-result-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AppProxyService {
  
  baseUrl = "http://qa.webit-track.com/MeromimReviewQA/Service/Service1.svc/";
  constructor(private http : HttpClient, public dialog: MatDialog){
    this.dialog=dialog;
  }
  post(url : string, data) : Promise<any> {
    console.log (url);
    console.log (JSON.stringify(data));
    return this.http.post(`${this.baseUrl}${url}`, data).toPromise();
  }
  openDialog(text) {
    const dialogRef = this.dialog.open(ActionsResultDialogComponent, {
     height:'200px',
     width: '400px',
    data:{text:text}
    });
  }
 
  // get(url: string): Promise<any>{
  //     console.log(url);
  //     return this.http.post(`${this.baseUrl}${url}`,null).toPromise();
  // }
  
}

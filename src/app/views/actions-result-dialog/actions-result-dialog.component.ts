import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  text: string;
}
@Component({
  selector: 'app-actions-result-dialog',
  templateUrl: './actions-result-dialog.component.html',
  styleUrls: ['./actions-result-dialog.component.css']
})
export class ActionsResultDialogComponent implements OnInit {
//מקבל טקסט כלשהו להציג בחלון
  constructor(public dialogRef: MatDialogRef<ActionsResultDialogComponent> 
    ,@Inject(MAT_DIALOG_DATA) public data:DialogData) { }

  ngOnInit() {
  }
  onOkClick(): void {
    this.dialogRef.close();
  }
}

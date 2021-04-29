import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import {

  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatOptionModule,
  MatPaginatorModule,
  MatSortModule,
  MatGridListModule,
  MatSlideToggleModule, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, MatTableModule
} from '@angular/material';
import { MyRoutingModule } from './Route/my-routing.module';
//import {AppProxy} from './services/app.proxy';
//import {AgGridModule} from 'ag-grid-angular';
//import {AppServiceService}  from './services/app-service.service';
import { RouterModule } from '@angular/router';
// import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './views/Main/login/login.component';
import { NavigateComponent } from './views/navigate/navigate.component';
import { ProjectReviewComponent } from './views/project-review/project-review.component';
import { ResultComponent } from './views/result/result.component';
import { ProjectTypeComponent } from './views/project-type/project-type.component';
import { DialogDeleteComponent } from './views/dialog-delete/dialog-delete.component';
import { ActionsResultDialogComponent } from './views/actions-result-dialog/actions-result-dialog.component';
import { QuestionsDetailsComponent } from './views/questions-details/questions-details.component';
import { EditProjectComponent } from './views/edit-project/edit-project.component';
import { CopyProjectDialogComponent } from './views/copy-project-dialog/copy-project-dialog.component';
import { ShowReviewsComponent } from './views/show-reviews/show-reviews.component';
import { DateParsePipe } from './Pipes/date-parse.pipe';
import { DatePipe } from '@angular/common';
import { AddReviewComponent } from './views/add-review/add-review.component';
import { ChartComponent } from './views/chart/chart/chart.component';
import { RevChartComponent } from './views/chart/rev-chart/rev-chart.component';
import { EndReviewComponent } from './views/end-review/end-review.component';
//import { AppProxyService } from './services/app-proxy.service'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigateComponent,
    ProjectReviewComponent,
    ResultComponent,
    ProjectTypeComponent,
    CopyProjectDialogComponent,
    DialogDeleteComponent,
    ActionsResultDialogComponent,
    QuestionsDetailsComponent,
    EditProjectComponent,
    CopyProjectDialogComponent,
    ShowReviewsComponent,
    DateParsePipe,
    AddReviewComponent,
    ChartComponent,
    RevChartComponent,
    EndReviewComponent
  ],
  imports: [
    MyRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    HttpClientModule,
    //AgGridModule,
    RouterModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [DialogDeleteComponent, ActionsResultDialogComponent, CopyProjectDialogComponent, AddReviewComponent,EndReviewComponent],
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }, DatePipe, DateParsePipe,ChartComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

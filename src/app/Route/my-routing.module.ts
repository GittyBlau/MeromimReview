//יש ליצור מודול שיכיל את טבלת הניתוב (ng g m nameModule)
//יש להוסיף מודול זה למודול הראשי

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//מודולים אלו מטפלים בניווט
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../views/Main/login/login.component';
import { NavigateComponent } from '../views/navigate/navigate.component';
import { ProjectReviewComponent } from '../views/project-review/project-review.component';
import { ProjectTypeComponent } from '../views/project-type/project-type.component';
import { ResultComponent } from '../views/result/result.component';
import { EditProjectComponent } from '../views/edit-project/edit-project.component';
import { QuestionsDetailsComponent } from '../views/questions-details/questions-details.component';
import { ShowReviewsComponent } from '../views/show-reviews/show-reviews.component';
import { RevChartComponent } from '../views/chart/rev-chart/rev-chart.component';

const appRoutes: Routes = [
   { path: "", component: LoginComponent },
  { path: "Navigate", component: NavigateComponent, children:[
    { path: "ProjectReview", component: ProjectReviewComponent },
    { path: "ProjectType", component: ProjectTypeComponent},
    { path: "Result", component: ResultComponent },
    {path:"Answers",component:ShowReviewsComponent },
    {path:"RevChart",component:RevChartComponent },
   { path: "EditProject", component: EditProjectComponent,children:[{ path: "", component: QuestionsDetailsComponent }]}
  ]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    CommonModule
  ],
  declarations: []
})
export class MyRoutingModule { }

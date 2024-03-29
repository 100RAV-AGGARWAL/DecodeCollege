import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExamPostComponent } from './user/exam-create/exam-post.component';
import { ExamListComponent } from './user/exam-list/exam-list.component';
import { ExamViewComponent } from './user/exam-view/exam-view.component';
import { AuthGuard } from '../user/auth-guard.service';

const examRoutes: Routes = [
  {path: 'exam/post', component: ExamPostComponent, canActivate: [AuthGuard]},
  {path: 'exam/list', component: ExamListComponent, canActivate: [AuthGuard]},
  {path: 'exam/view/:id', component: ExamViewComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(examRoutes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }

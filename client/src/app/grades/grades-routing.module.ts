import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../user/auth-guard.service';
import { GradeViewComponent } from './grade-view/grade-view.component';
import { GradesFormComponent } from './grades-form/grades-form.component';
// import { CoursesComponent } from './courses/courses.component';
const routes: Routes = [
  {path: 'grades/calculate', component: GradesFormComponent, canActivate: [AuthGuard]},
  {path: 'grades/view', component: GradeViewComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradesRoutingModule { }

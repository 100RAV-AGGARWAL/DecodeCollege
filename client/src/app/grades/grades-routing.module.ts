import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../user/auth-guard.service';
import { GradesFormComponent } from './grades-form/grades-form.component';
// import { CoursesComponent } from './courses/courses.component';
const routes: Routes = [
  {path: 'grades', component: GradesFormComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradesRoutingModule { }

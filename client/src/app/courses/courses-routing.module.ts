import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../user/auth-guard.service';
import { CoursesComponent } from './courses/courses.component';

const routes: Routes = [
  {path: 'courses', component: CoursesComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }

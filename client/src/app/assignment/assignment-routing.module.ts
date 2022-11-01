import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssignmentPostComponent } from './user/assignment-post/assignment-post.component';
import { AssignmentDeleteComponent } from './user/assignment-delete/assignment-delete.component';
import { AssignmentMyassignmentsComponent } from './user/assignment-myassignments/assignment-myassignments.component';
import { AssignmentEditComponent } from './user/assignment-edit/assignment-edit.component';
import { AssignmentViewComponent } from './user/assignment-view/assignment-view.component';
import { AuthGuard } from '../user/auth-guard.service';

const assignentRoutes: Routes = [
  {path: 'assignment/post', component: AssignmentPostComponent, canActivate: [AuthGuard]},
  {path: 'assignment/delete', component: AssignmentDeleteComponent, canActivate: [AuthGuard]},
  {path: 'assignment/myAssignments', component: AssignmentMyassignmentsComponent, canActivate: [AuthGuard]},
  {path: 'assignment/edit/:id', component: AssignmentEditComponent, canActivate: [AuthGuard]},
  {path: 'assignment/view/:id', component: AssignmentViewComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(assignentRoutes)],
  exports: [RouterModule]
})
export class AssignmentRoutingModule { }

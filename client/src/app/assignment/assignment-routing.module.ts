import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssignmentPostComponent } from './user/assignment-post/assignment-post.component';
import { AssignmentDeleteComponent } from './user/assignment-delete/assignment-delete.component';
import { AssignmentMyassignmentsComponent } from './user/assignment-myassignments/assignment-myassignments.component';
import { AssignmentEditComponent } from './user/assignment-edit/assignment-edit.component';
import { AssignmentViewComponent } from './user/assignment-view/assignment-view.component';

const assignentRoutes: Routes = [
  {path: 'assignment/post', component: AssignmentPostComponent},
  {path: 'assignment/delete', component: AssignmentDeleteComponent},
  {path: 'assignment/myAssignments', component: AssignmentMyassignmentsComponent},
  {path: 'assignment/edit/:id', component: AssignmentEditComponent},
  {path: 'assignment/view/:id', component: AssignmentViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(assignentRoutes)],
  exports: [RouterModule]
})
export class AssignmentRoutingModule { }

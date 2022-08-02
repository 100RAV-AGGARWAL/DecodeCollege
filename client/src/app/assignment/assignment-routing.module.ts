import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssignmentPostComponent } from './user/assignment-post/assignment-post.component';
import { AssignmentDeleteComponent } from './user/assignment-delete/assignment-delete.component';

const assignentRoutes: Routes = [
  {path: 'assignment/post', component: AssignmentPostComponent},
  {path: 'assignment/delete', component: AssignmentDeleteComponent},
];

@NgModule({
  imports: [RouterModule.forChild(assignentRoutes)],
  exports: [RouterModule]
})
export class AssignmentRoutingModule { }

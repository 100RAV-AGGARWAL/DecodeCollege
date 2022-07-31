import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentRoutingModule } from './assignment-routing.module';
import { AssignmentPostComponent } from './user/assignment-post/assignment-post.component';
import { AssignmentDeleteComponent } from './user/assignment-delete/assignment-delete.component';


@NgModule({
  declarations: [
    AssignmentPostComponent,
    AssignmentDeleteComponent
  ],
  imports: [
    CommonModule,
    AssignmentRoutingModule
  ]
})
export class AssignmentModule { }

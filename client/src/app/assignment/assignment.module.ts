import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentRoutingModule } from './assignment-routing.module';
import { AssignmentPostComponent } from './user/assignment-post/assignment-post.component';
import { AssignmentDeleteComponent } from './user/assignment-delete/assignment-delete.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { UtilityModule } from "../utility/utility.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { AssignmentService } from './assignment.service';
import { UserModule } from '../user/user.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AssignmentPostComponent,
    AssignmentDeleteComponent
  ],
  imports: [
    CommonModule,
		FormsModule,
		ReactiveFormsModule,
    AssignmentRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    HttpClientModule,
    MatOptionModule,
    UtilityModule,
    MatSnackBarModule,
    UserModule,
    FileUploadModule
  ],
  providers: [
    AssignmentService
  ]
})
export class AssignmentModule { }

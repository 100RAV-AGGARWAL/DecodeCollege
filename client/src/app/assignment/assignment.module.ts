import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AssignmentRoutingModule } from './assignment-routing.module';
import { AssignmentPostComponent } from './user/assignment-post/assignment-post.component';
import { AssignmentDeleteComponent } from './user/assignment-delete/assignment-delete.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { UtilityModule } from "../utility/utility.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { AssignmentService } from './assignment.service';
import { UserModule } from '../user/user.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FileUploadModule } from 'ng2-file-upload';
import { AssignmentMyassignmentsComponent } from './user/assignment-myassignments/assignment-myassignments.component';
import { AssignmentViewComponent } from './user/assignment-view/assignment-view.component';
import { AssignmentEditComponent } from './user/assignment-edit/assignment-edit.component';
import  {  PdfViewerModule  }  from  'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [
    AssignmentPostComponent,
    AssignmentDeleteComponent,
    AssignmentMyassignmentsComponent,
    AssignmentViewComponent,
    AssignmentEditComponent
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
    FileUploadModule,
    MatDialogModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AssignmentService,
    DatePipe
  ]
})
export class AssignmentModule { }

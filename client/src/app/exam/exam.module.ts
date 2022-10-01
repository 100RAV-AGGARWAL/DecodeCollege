import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ExamRoutingModule } from './exam-routing.module';
import { ExamPostComponent } from './user/exam-create/exam-post.component';

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
import { ExamService } from './exam.service';
import { UserModule } from '../user/user.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ExamListComponent } from './user/exam-list/exam-list.component';
import { ExamViewComponent } from './user/exam-view/exam-view.component';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [
    ExamPostComponent,
    ExamListComponent,
    ExamViewComponent,
  ],
  imports: [
    CommonModule,
		FormsModule,
		ReactiveFormsModule,
    ExamRoutingModule,
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
    MatDialogModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  providers: [
    ExamService,
    DatePipe
  ]
})
export class ExamModule { }

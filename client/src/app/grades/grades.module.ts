import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GradesRoutingModule } from './grades-routing.module';
import { GradesFormComponent } from './grades-form/grades-form.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { UtilityModule } from "../utility/utility.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { UserModule } from '../user/user.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GradeViewComponent } from './grade-view/grade-view.component';

@NgModule({
  declarations: [
    GradesFormComponent,
    GradeViewComponent
  ],
  imports: [
    CommonModule,
    GradesRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatDividerModule,
    HttpClientModule,
    MatOptionModule,
    UtilityModule,
    MatSnackBarModule,
    UserModule,
    FormsModule
  ]
})
export class GradesModule { }

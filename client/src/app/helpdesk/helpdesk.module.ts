import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpdeskRoutingModule } from './helpdesk-routing.module';
import { DoubtcreateComponent } from './helpdesk-user/doubt-create/doubt-create.component';

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
import { UserModule } from '../user/user.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DoubtListComponent } from './academic-support/doubt-list/doubt-list.component';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserDoubtListComponent } from './helpdesk-user/user-doubt-list/user-doubt-list.component';
@NgModule({
  declarations: [

    DoubtcreateComponent,
    DoubtListComponent,
    UserDoubtListComponent
  ],
  imports: [
    CommonModule,
    HelpdeskRoutingModule,
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
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    UserModule,
    MatDialogModule,
    MatSortModule,
    MatProgressSpinnerModule
  ]
})
export class HelpdeskModule { }

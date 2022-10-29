import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPortalRoutingModule } from './admin-portal-routing.module';
import { SubjectComponent } from './subject/subject.component';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    SubjectComponent,
  ],
  imports: [
    CommonModule,
    AdminPortalRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatOptionModule,
    FormsModule,
    MatSelectModule
  ]
})
export class AdminPortalModule { }

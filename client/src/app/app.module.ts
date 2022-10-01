import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './home/home.module';
import { UtilityModule } from './utility/utility.module';
import { AssignmentModule } from './assignment/assignment.module';
import { NoteModule } from './note/note.module';
import { TimeoutModule } from './timeout/timeout.module';
import { GradesModule } from './grades/grades.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { appRoutes } from './app.route';
import { ToastrModule } from 'ngx-toastr';
import { ExamModule } from './exam/exam.module';
// import { GradesComponent } from './grades/grades.component';

@NgModule({
  declarations: [

    AppComponent

    // GradesComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NoteModule,
    GradesModule,
    UserModule,
    LayoutModule,
    HomeModule,
    UtilityModule,
    TimeoutModule,
    AssignmentModule,
    ExamModule,
    RouterModule.forRoot(
			appRoutes,
			{ enableTracing: true, relativeLinkResolution: 'legacy' } 
		),
    ToastrModule.forRoot(),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

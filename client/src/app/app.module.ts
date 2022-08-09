import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './home/home.module';
import { UtilityModule } from './utility/utility.module';
import { AssignmentModule } from './assignment/assignment.module';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { appRoutes } from './app.route';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    UserModule,
    LayoutModule,
    HomeModule,
    UtilityModule,
    AssignmentModule,
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

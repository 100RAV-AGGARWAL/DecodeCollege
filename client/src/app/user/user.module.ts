import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserLoginComponent } from "./user/userlogin/user-login.component";
import { UserSignupComponent } from "./user/usersignup/user-signup.component";
import { UserViewComponent } from "./user/userview/user-view.component";
import { UserService } from "./user.service";
import { UserForgotPasswordComponent } from "./user/userforgotpassword/user-forgotpassword.component";
import { UserResetPasswordComponent } from "./user/userresetpassword/user-resetpassword.component";
import { UserRoutingModule } from "./user-routing.module";
import { UtilityModule } from "../utility/utility.module";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthGuard } from './auth-guard.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		UserRoutingModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		UtilityModule,
		MatTableModule,
		MatPaginatorModule,
		MatCardModule,
		MatIconModule,
	],
	declarations: [
		UserLoginComponent,
		UserSignupComponent,
		UserViewComponent,
		UserForgotPasswordComponent,
		UserResetPasswordComponent
	],
	providers: [
		AuthGuard,
		UserService
	]

})
export class UserModule { }
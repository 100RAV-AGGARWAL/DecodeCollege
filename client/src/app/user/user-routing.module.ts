import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLoginComponent } from "./user/userlogin/user-login.component";
import { UserSignupComponent } from "./user/usersignup/user-signup.component";
import { UserViewComponent } from "./user/userview/user-view.component";
import { UserProfileComponent } from "./user/userprofile/userprofile.component";
import { AuthGuard } from '../user/auth-guard.service';
import { UserForgotPasswordComponent } from "./user/userforgotpassword/user-forgotpassword.component";
import { UserResetPasswordComponent } from "./user/userresetpassword/user-resetpassword.component";

const userRoutes: Routes = [
	{ path: 'user/login', component: UserLoginComponent },
	{ path: 'user/signup', component: UserSignupComponent },
	{ path: 'user/view', component: UserViewComponent },
	{ path: "user/forgot", component: UserForgotPasswordComponent },
	{ path: "user/reset/:token", component: UserResetPasswordComponent },
	{ path: "user/profile", component: UserProfileComponent,canActivate: [AuthGuard] },
]

@NgModule({
	imports: [
		RouterModule.forChild(userRoutes)
	],
	exports: [
		RouterModule
	]
})
export class UserRoutingModule { }
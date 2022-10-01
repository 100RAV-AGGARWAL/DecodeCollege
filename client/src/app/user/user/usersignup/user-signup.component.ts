import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { UserService } from "../../user.service";
import { SnackBarService } from '../../../utility/snackbar/snackbar.component';

@Component({
	selector: 'app-signup',
	templateUrl: './user-signup.component.html',
	styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

	signupData = { username: '', password: '', first: "", last: "", email: "",phone:"", retypedpassword: ""};
	message = '';
	data: any;
	constructor(private http: HttpClient, private router: Router, private userService: UserService, private _snackBar: SnackBarService) {
	}

	ngOnInit() {
	}

	signup() {
			this.userService.signup(this.signupData).subscribe(res => {
				this._snackBar.openSnackBar("Successfull Sign up. Please refer your email for activation", "X");
				this.router.navigate(['/']);
			}, err => {
				this._snackBar.openSnackBar("Please fix errors " + err.error.error, "X");
			});
	}

}

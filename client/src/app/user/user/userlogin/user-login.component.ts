import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { UserService } from "../../user.service";
import { SnackBarService } from '../../../utility/snackbar/snackbar.component';

@Component({
	selector: 'app-login',
	templateUrl: './user-login.component.html',
	styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

	loginData = { username: '', password: '' };
	message = '';
	data: any;

	constructor(private http: HttpClient, private router: Router, private userService: UserService, private _snackBar: SnackBarService) { }

	ngOnInit() {
	}

	login() {
		this.userService.login(this.loginData.username, this.loginData.password).subscribe(res => {
			this._snackBar.openSnackBar("Logged in", "X");
		}, err => {
			this._snackBar.openSnackBar(err.error.error, "X");
		});
	}
}

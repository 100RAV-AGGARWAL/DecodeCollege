import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserService } from "../../user.service";
import { SnackBarService } from "../../../utility/snackbar/snackbar.component";

@Component({
	selector: "app-forgotpassword",
	templateUrl: "./user-forgotpassword.component.html",
	styleUrls: ["./user-forgotpassword.component.css"],
})
export class UserForgotPasswordComponent implements OnInit {
	emailId = { username: "" };
	message = " ";
	data: any;

	constructor(private http: HttpClient, private router: Router, private userService: UserService, private _snackBar: SnackBarService) { }

	ngOnInit() { }

	forgotpassword() {
		this.userService.forgotpassword(this.emailId.username).subscribe(
			(res) => {
				this._snackBar.openSnackBar("Please check your email for password reset link", "X");
				this.router.navigate(['/']);
			},
			(err) => {
				this._snackBar.openSnackBar(err.error.error, "X");
			}
		);
	}
}
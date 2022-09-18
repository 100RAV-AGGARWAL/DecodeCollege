import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../user.service";
import { SnackBarService } from "../../../utility/snackbar/snackbar.component";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-resetpassword",
	templateUrl: "./user-resetpassword.component.html",
	styleUrls: ["./user-resetpassword.component.css"],
})
export class UserResetPasswordComponent implements OnInit {
	user = { password: "", retypepassword: "", token: "" };
	message = "";
	data: any;
	token;
	constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private userService: UserService, private _snackBar: SnackBarService) {
		this.token = this.route.snapshot.paramMap.get('token');
		this.userService.verifytoken(this.token).subscribe(res => {
			this._snackBar.openSnackBar("Please reset password", "X");
		}, err => {
			this._snackBar.openSnackBar("Token is invalid", "X");
		});
	}

	ngOnInit() { }

	resetpassword() {
		this.user.token = this.token;
		this.userService.resetpassword(this.user).subscribe((res) => {
			this._snackBar.openSnackBar("message", "X");
			this.router.navigate(['/']);
		}, (err) => {
			this._snackBar.openSnackBar(err.error.error, "X");
		});
	}
}
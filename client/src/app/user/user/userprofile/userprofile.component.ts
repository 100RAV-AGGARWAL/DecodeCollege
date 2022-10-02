import { Component, OnInit } from '@angular/core';
import { UserService } from "../../user.service";
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackBarService } from '../../../utility/snackbar/snackbar.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
	selector: 'user-profile',
	templateUrl: './userprofile.component.html',
	styleUrls: ['./userprofile.component.css']
})
export class UserProfileComponent implements OnInit {
	_id;
	user={
		first:"",
		email:"",
		phone:"",
		createdAt:""
	};
	constructor(private userService: UserService,
		private route: ActivatedRoute,
		private _snackBar: SnackBarService,
		private title: Title) {
		this.userService.getProfile().subscribe(res => {
			this.user = res["user"];
		}, err => {
			this._snackBar.openSnackBar("User profile not available", "X");
		});
	}
	ngOnInit() {
		
	}
}
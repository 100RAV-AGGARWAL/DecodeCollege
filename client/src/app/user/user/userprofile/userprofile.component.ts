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
	user;
	constructor(private userService: UserService,
		private route: ActivatedRoute,
		private _snackBar: SnackBarService,
		private title: Title) {
	}
	ngOnInit() {
		this._id = this.route.snapshot.paramMap.get('id');
		if (!this._id) {
			this._id = this.userService.getUserId();
		}
		this.userService.getProfile(this._id).subscribe(res => {
			this.user = res["user"];
			this.title.setTitle(+ this.user.name + " Profile");

		}, err => {
			this._snackBar.openSnackBar("User profile not available", "X");
		});

	}
}
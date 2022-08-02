import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from "./user.service";
import { SnackBarService } from '../utility/snackbar/snackbar.component';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private userService: UserService, private router: Router, private _snackBar: SnackBarService) {

	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this.userService.isLoggedIn()) { return true; }

		let url: string = state.url;
		this.userService.redirectUrl = url;
		this._snackBar.openSnackBar("Please Login", "X");
		this.router.navigate(['/user/login']);
		return false;
	}
}
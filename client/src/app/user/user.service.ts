import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	public redirectUrl;

	constructor(private router: Router) { }

	getJWTToken() {
		if (localStorage.getItem("jwtToken")) {
			return localStorage.getItem("jwtToken");
		}
		return "";
	}

	logoutUser() {
		localStorage.removeItem('jwtToken');
		localStorage.removeItem("role")
		this.router.navigate(['user/login']);
	}

	isLoggedIn() {
		var token = this.getJWTToken();
		if (token) {
			try {
				if (parseInt(localStorage.getItem('lastLoggedIn')!) + (parseInt(localStorage.getItem('totaltime')!) * 1000) > Date.now()) {
					return true;
				}
			} catch (err) {
				this.logoutUser();
			}
			this.logoutUser();
		}
		return false;
	}
}

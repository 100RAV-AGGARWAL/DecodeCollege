import { Injectable, Inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	public redirectUrl;

	constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

	getJWTToken() {
		if (localStorage.getItem("jwtToken")) {
			return localStorage.getItem("jwtToken");
		}
		return "";
	}

	login(username: string, password: string) {
		let loginData = {
			email: username,
			password: password,
		}
		return new Observable((observer) => {
			this.http.post(environment.apiUrl + 'api/users/login', loginData).subscribe(resp => {
				localStorage.setItem('jwtToken', resp["token"]);
				localStorage.setItem('role', resp["user"]["role"]);
				localStorage.setItem('userId', resp["user"]["_id"]);
				localStorage.setItem('lastLoggedIn', Date.now().toString());
				localStorage.setItem('totaltime', resp["totalTime"]);
				this.router.navigate(['']);
				observer.next(resp);
			}, err => {
				observer.error(err);
			});
		});
	}

	logoutUser() {
		localStorage.clear();
		this.router.navigate(['']);
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

	signup(signupData: {
		username: string; password: string; first: string;
		last: string; email: string; retypedpassword: string;
	}) {
		return new Observable((observer) => {
			this.http.post(environment.apiUrl + 'api/users', signupData).subscribe(resp => {
				observer.next(resp);
			}, err => {
				observer.error(err);
			});
		});
	}

	forgotpassword(username: any) {
		let emailId = {
			email: username,
		};
		return new Observable((observer) => {
			this.http.post(environment.apiUrl + "api/forgot", emailId).subscribe(
				(resp) => {
					observer.next(resp);
				},
				(err) => {
					observer.error(err);
				}
			);
		});
	}

	verifytoken(token: any) {
		return this.http.post(environment.apiUrl + "api/reset/verify", { token: token });
	}

	resetpassword(user: any) {
		return this.http.post(environment.apiUrl + "api/reset/password", user);
	}

	isAdmin() {
		if (this.isLoggedIn()) {
			return localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "superuser";
		}
		return false
	}

	isAcademicSupport() {
		if (this.isLoggedIn()) {
			return localStorage.getItem("role") === "academic-support";
		}
		return false
	}

	isCustomerSupport() {
		if (this.isLoggedIn()) {
			return localStorage.getItem("role") === "customer-support";
		}
		return false
	}

	isUser() {
		if (this.isLoggedIn()) {
			return localStorage.getItem("role") === "user";
		}
		return false
	}

	isOwner(userId:any) {
		if (this.isLoggedIn()) {
			return localStorage.getItem("userId") === userId;
		}
		return false
	}

	getUserId() {
		if (this.isLoggedIn()) {
			return localStorage.getItem("userId");
		}
		return false
	}
	getProfile() {
		return this.http.get(environment.apiUrl + 'api/users/profile',{
			headers: {
				"Authorization": this.getJWTToken()!
			  }
		});
	}
}

import { Injectable, Inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UserService {


	constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }



	login(username: string, password: string) {
		let loginData = {
			email: username,
			password: password,
		}
		return new Observable((observer) => {
			this.http.post(environment.apiUrl + 'api/users/login', loginData).subscribe(resp => {
				observer.next(resp);
			}, err => {
				observer.error(err);
			});
		});
	}



	logout() {
		localStorage.removeItem("role")
		this.router.navigate(['']);
	}

	logoutUser() {
		localStorage.removeItem("role")
		this.router.navigate(['user/login']);
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

}

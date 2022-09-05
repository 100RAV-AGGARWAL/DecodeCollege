import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root'
})
export class AssignmentService {

	constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

	saveAssignments(assignment: any) {
		return new Observable((observer) => {
			this.http.post(environment.apiUrl + 'api/assignment', assignment, {
				headers: {
					"Authorization": this.userService.getJWTToken()!
				}
			}).subscribe(resp => {
				this.router.navigate(['/assignment/myAssignments']);
				observer.next(resp);
			}, err => {
				if (err.status == 401) {
					this.userService.logoutUser();
				}
				observer.error(err);
			});
		});
	}

	getSubject() {
		return this.http.get(environment.apiUrl + 'api/subject/list');
	}

	getMyAssignment(pagination) {
		let limit = pagination.limit;
		let offset = limit * pagination.pageIndex;

		return this.http.get(environment.apiUrl + 'api/assignment/myAssignments?limit=' + limit + "&offset=" + offset, {
			headers: {
				"Authorization": this.userService.getJWTToken()!
			}
		});

	}

	getAssignment(id) {
		return this.http.get(environment.apiUrl + 'api/assignment?_id=' + id, {
			headers: {
				"Authorization": this.userService.getJWTToken()!
			}
		});
	}

	updateAssignments(assignment: any) {
		return new Observable((observer) => {
			this.http.put(environment.apiUrl + 'api/assignment', assignment, {
				headers: {
					"Authorization": this.userService.getJWTToken()!
				}
			}).subscribe(resp => {
				this.router.navigate(['/assignment/myAssignments']);
				observer.next(resp);
			}, err => {
				if (err.status == 401) {
					this.userService.logoutUser();
				}
				observer.error(err);
			});
		});
	}
}

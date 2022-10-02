import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

interface Exam {
	name: any;
	subject: any;
	semester: any;
	date: any;
	status: any;
}

interface ExamList {
	exam: Exam[];
	total: number;
}

@Injectable({
	providedIn: 'root'
})
export class ExamService {

	constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

	saveExam(exam: any) {
		return new Observable((observer) => {
			this.http.post(environment.apiUrl + 'api/exam/create', exam, {
				headers: {
					"Authorization": this.userService.getJWTToken()!
				}
			}).subscribe(resp => {
				this.router.navigate(['/exam/list']);
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
	getSemester() {
		return this.http.get(environment.apiUrl + 'api/semester/mySemesters', {
		  headers: {
			"Authorization": this.userService.getJWTToken()!
		  },
		});
	}

	getMyExams(pagination){
		let limit = pagination.limit;
		let offset = limit * pagination.pageIndex;

		return this.http.get(environment.apiUrl + 'api/exam/list?limit=' + limit + "&offset=" + offset, {
			headers: {
				"Authorization": this.userService.getJWTToken()!
			}
		});

	}

	getExams(id) {
		return this.http.get(environment.apiUrl + 'api/exam?_id=' + id, {
			headers: {
				"Authorization": this.userService.getJWTToken()!
			}
		});
	}

	getExamsByMonth(month, year) {
		return this.http.get(environment.apiUrl + 'api/exam/getListByMonth?month=' + month + '&year=' + year, {
			headers: {
				"Authorization": this.userService.getJWTToken()!
			}
		});
	}
}

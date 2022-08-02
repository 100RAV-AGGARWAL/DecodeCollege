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
			this.http.post(environment.apiUrl + 'api/assignent', assignment, {
				headers: {
					"Authorization": this.userService.getJWTToken()!
				}
			}).subscribe(resp => {
				this.router.navigate(['/assignments/myAssignments']);
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

  public uploadFile(file: File, fileId: any): Observable<Object> {
		const formData = new FormData();

		formData.append('file', file);
		formData.append('fileId', fileId);

		return this.http.post(environment.apiUrl + 'api/upload/assignment', formData, {
			headers: {
				"Authorization": this.userService.getJWTToken()!
			}
		});
	}
}

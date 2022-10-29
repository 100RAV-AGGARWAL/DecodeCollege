import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

interface AcademicDoubt {
  description: any;
  status: any;
  createdAt: any;
  raisedBy: any;
}

interface AcademicDoubtList {
  doubts: AcademicDoubt[];
  total: number;
}

interface UserDoubt {
  topic: any;
  description: any;
  status: any;
  createdAt: any;
}

interface UserDoubtList {
  doubts: UserDoubt[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class HelpdeskService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  createDoubt(doubt: any) {
    return this.http.post(environment.apiUrl + 'api/doubt/create', doubt, {
      headers: {
        "Authorization": this.userService.getJWTToken()!
      }
    });
  }

  getAcademicDoubtList(pagination, sort, order): Observable<AcademicDoubtList>{
		let limit = pagination.limit;
		let offset = limit * pagination.pageIndex;

		return this.http.get<AcademicDoubtList>(environment.apiUrl + 'api/doubt/listAcademicDoubts?limit=' + limit + "&offset=" + offset + "&sort=" + sort + "&order=" + order, {
			headers: {
				"Authorization": this.userService.getJWTToken()!
			}
		});

	}

  getUserDoubtList(pagination, sort, order): Observable<UserDoubtList>{
		let limit = pagination.limit;
		let offset = limit * pagination.pageIndex;

		return this.http.get<UserDoubtList>(environment.apiUrl + 'api/doubt/listUserDoubts?limit=' + limit + "&offset=" + offset + "&sort=" + sort + "&order=" + order, {
			headers: {
				"Authorization": this.userService.getJWTToken()!
			}
		});

	}
}

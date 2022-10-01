import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
@Injectable({
  providedIn: 'root'
})
export class GradesService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }
  getSubject(sem) {
    return new Observable((observer) => {
      // console.log(sem);
      this.http.post(environment.apiUrl + 'api/subject/listbysem', sem, {
        headers: {
          "Authorization": this.userService.getJWTToken()!
        },
      }).subscribe(resp => {
        // this.router.navigate(['/dashboard']);
        observer.next(resp);
      }, err => {
        if (err.status == 401) {
          this.userService.logoutUser();
        }
        observer.error(err);
      });
    })
    // return new Observable((observer) => {
    //   console.log(sem);
    //   this.http.post(environment.apiUrl + 'api/subject/listbysem', {sem:sem}, {
    //     headers: {
    //       "Authorization": this.userService.getJWTToken()!
    //     },
    //   }).subscribe(resp => {
    //     // this.router.navigate(['/dashboard']);
    //     observer.next(resp);
    //   }, err => {
    //     if (err.status == 401) {
    //       this.userService.logoutUser();
    //     }
    //     observer.error(err);
    //   });
    // })
    // return this.http.post(environment.apiUrl + 'api/subject/list');
  }
  getSemester() {
    return this.http.get(environment.apiUrl + 'api/semester/mySemesters', {
      headers: {
        "Authorization": this.userService.getJWTToken()!
      },
    });
  }

  saveGrades(arr: any) {
    // return this.http.post(environment.apiUrl + 'api/subject');
    return new Observable((observer) => {
      console.log(arr);
      this.http.post(environment.apiUrl + 'api/semester/grade', arr, {
        headers: {
          "Authorization": this.userService.getJWTToken()!
        },

      }).subscribe(resp => {
        this.router.navigate(['/dashboard']);
        observer.next(resp);
      }, err => {
        if (err.status == 401) {
          this.userService.logoutUser();
        }
        observer.error(err);
      });
    })
  }















}

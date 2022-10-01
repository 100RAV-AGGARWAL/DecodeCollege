import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminPortalService {

  constructor(private http: HttpClient,private userService:UserService,private router: Router) { 
   
  }
  createSubject(subject) {
    return new Observable((observer) => {
      this.http.post(environment.apiUrl + 'api/subject', subject, {
        headers: {
          "Authorization": this.userService.getJWTToken()!
        }
      }).subscribe(resp => {
      window.location.reload();
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

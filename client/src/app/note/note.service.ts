import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }
    getSubject() {
      return this.http.get(environment.apiUrl + 'api/subject/list');
    }
    saveNotes(note: any) {
      return new Observable((observer) => {
        this.http.post(environment.apiUrl + 'api/note', note, {
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
      })
    }
    
        
  
  
}

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
          this.router.navigate(['/notes/mynotes']);
         observer.next(resp);
       }, err => {
          if (err.status == 401) {
            this.userService.logoutUser();
          }
          observer.error(err);
       });
      })
    }
    NotesList(pagination) {
      let limit = pagination.limit;
		let offset = limit * pagination.pageIndex;
    return this.http.get(environment.apiUrl + 'api/note/mynotes?limit=' + limit + "&offset=" + offset, {
      headers: {
        "Authorization": this.userService.getJWTToken()!
      }
    });
    }
    getNotes(id) {
      return this.http.get(environment.apiUrl + 'api/note?_id=' + id, {
        headers: {
          "Authorization": this.userService.getJWTToken()!
        }
      });
    }
    subject(id){
         return this.http.get(environment.apiUrl+'api/subject?_id='+id,{
          headers: {
            "Authorization": this.userService.getJWTToken()!
          }
        });
    }
        
    updateNotes(assignment: any) {
      return new Observable((observer) => {
        this.http.put(environment.apiUrl + 'api/note', assignment, {
          headers: {
            "Authorization": this.userService.getJWTToken()!
          }
        }).subscribe(resp => {
          this.router.navigate(['/notes/mynotes']);
          observer.next(resp);
        }, err => {
          if (err.status == 401) {
            this.userService.logoutUser();
          }
          observer.error(err);
        });
      });
    }
  
    deleteNote(body:any) {
      return new Observable((observer) => {
        this.http.delete(environment.apiUrl + 'api/note?noteId=' + body._id + '&fileId=' + body.fileId, {
          headers: {
            "Authorization": this.userService.getJWTToken()!
          }
        }).subscribe(resp => {
          this.router.navigate(['/notes/mynotes']);
          observer.next(resp);
        }, err => {
          if (err.status == 401) {
            this.userService.logoutUser();
          }
          observer.error(err);
        });
      });
    }
    PublicNotesList(pagination) {
      let limit = pagination.limit;
		let offset = limit * pagination.pageIndex;
    return this.http.get(environment.apiUrl + 'api/note/public?limit=' + limit + "&offset=" + offset);
    }

    getPublicNote(id) {
      return this.http.get(environment.apiUrl + 'api/note/view?_id=' + id);
    }
}

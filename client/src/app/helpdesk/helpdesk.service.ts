import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';
import { UserService } from '../user/user.service';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';

interface Doubt {
  id: any;
  topic: any;
  description: any;
  status: any;
  createdAt: any;
  raisedBy: any;
}

interface DoubtList {
  doubts: Doubt[];
  total: number;
}

interface ChatStatus {
  [sender: string]: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class HelpdeskService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService, private db: AngularFirestore) { }

  createDoubt(doubt: any) {
    return this.http.post(environment.apiUrl + 'api/doubt/create', doubt, {
      headers: {
        "Authorization": this.userService.getJWTToken()!
      }
    });
  }

  getAcademicDoubtList(pagination, sort, order): Observable<DoubtList> {
    let limit = pagination.limit;
    let offset = limit * pagination.pageIndex;

    return this.http.get<DoubtList>(environment.apiUrl + 'api/doubt/listAcademicDoubts?limit=' + limit + "&offset=" + offset + "&sort=" + sort + "&order=" + order, {
      headers: {
        "Authorization": this.userService.getJWTToken()!
      }
    });

  }

  getCustomerDoubtList(pagination, sort, order): Observable<DoubtList> {
    let limit = pagination.limit;
    let offset = limit * pagination.pageIndex;

    return this.http.get<DoubtList>(environment.apiUrl + 'api/doubt/listCustomerDoubts?limit=' + limit + "&offset=" + offset + "&sort=" + sort + "&order=" + order, {
      headers: {
        "Authorization": this.userService.getJWTToken()!
      }
    });

  }

  getUserDoubtList(pagination, sort, order): Observable<DoubtList> {
    let limit = pagination.limit;
    let offset = limit * pagination.pageIndex;

    return this.http.get<DoubtList>(environment.apiUrl + 'api/doubt/listUserDoubts?limit=' + limit + "&offset=" + offset + "&sort=" + sort + "&order=" + order, {
      headers: {
        "Authorization": this.userService.getJWTToken()!
      }
    });
  }

  solveDoubt(doubtId: any) {
    return this.http.delete(environment.apiUrl + 'api/doubt/solve?_id=' + doubtId, {
      headers: {
        "Authorization": this.userService.getJWTToken()!
      }
    });
  }

  acceptDoubt(doubtId: any) {
    return this.http.post(environment.apiUrl + 'api/doubt/acceptDoubt', { id: doubtId }, {
      headers: {
        "Authorization": this.userService.getJWTToken()!
      }
    });
  }

  public getChat(id: string) {
    return this.db.collection('chats').doc(id);
  }

  public createChat(id: string) {
    return this.db.collection('chats').doc(id).set({ admin: false, user: false });
  }

  public deleteChat(id: string) {
    return this.db.collection('chats').doc(id).delete();
  }

  public getChatMessages(id: string, sender: string) {
    const orderByDate: QueryFn = ref => ref.orderBy('date');
    const messagesTimestampToDate = (messages: any[]) => messages.map(message => {
      return {
        ...message,
        date: (message.date as any).toDate(),
      };
    });
    const setMessageReply = (messages: any[]) => messages.map(message => Message.setReply(message, sender));
    const messagesCollection = this.db.collection('chats').doc(id).collection('messages', orderByDate);

    return messagesCollection.valueChanges().pipe(
      map(messagesTimestampToDate),
      map(setMessageReply),
    );
  }

  public getChatStatus(id: string, sender: string) {
    return this.db.collection('chats').doc(id).valueChanges().pipe(
      map((chat: any) => chat ? chat[sender] : false),
    );
  }

  public setLoading(id: string, status: ChatStatus) {
    return this.db.collection('chats').doc(id).update(status);
  }

  public addMessage(chatId: string, message: Message) {
    return this.db.collection('chats').doc(chatId).collection('messages').add({ ...message });
  }

}

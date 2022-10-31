import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { HelpdeskService } from '../../helpdesk.service';

@Component({
  selector: 'app-helpdesk-chat-portal',
  templateUrl: './helpdesk-chat-portal.component.html',
  styleUrls: ['./helpdesk-chat-portal.component.css']
})
export class HelpdeskChatPortalComponent implements OnInit {
  sessionId: any;
  title: any;
  sender: any;
  receiver: any;

  adminLoading$!: Observable<boolean>;
  messages$!: Observable<Message[]>;
  loading = false;
  private sub: any;

  constructor(private helpdeskService: HelpdeskService, private route: ActivatedRoute, private router: Router) {
    this.sub = this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'];
      this.title = "Academic-Support";
      this.sender = params['sender'];
      this.receiver = params['receiver'];
    });
  }

  ngOnInit() {
    document.body.classList.add('nb-theme-default');
    this.messages$ = this.helpdeskService.getChatMessages(this.sessionId, this.sender);
    this.adminLoading$ = this.helpdeskService.getChatStatus(this.sessionId, this.receiver);
  }

  handleUserMessage(event) {
    const text = event.message;
    if (!text) { return; }
    this.loading = false;
    this.helpdeskService.setLoading(this.sessionId, { [this.sender]: false });
    this.helpdeskService.addMessage(this.sessionId, new Message(text, this.sender));
  }

  onKey(event) {
    if (!event.target.value) {
      this.loading = false;
      this.helpdeskService.setLoading(this.sessionId, { [this.sender]: false });
      return;
    }

    if (!this.loading && event.key !== 'Enter') {
      this.helpdeskService.setLoading(this.sessionId, { [this.sender]: true });
    }

    this.loading = event.key !== 'Enter';
  }

  

}



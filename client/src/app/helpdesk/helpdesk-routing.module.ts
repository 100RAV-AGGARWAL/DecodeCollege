import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoubtListComponent } from './academic-support/doubt-list/doubt-list.component';
import { DoubtcreateComponent } from './helpdesk-user/doubt-create/doubt-create.component';
import { UserDoubtListComponent } from './helpdesk-user/user-doubt-list/user-doubt-list.component';
import { HelpdeskChatPortalComponent } from './chat-portal/helpdesk-chat-portal/helpdesk-chat-portal.component';

const routes: Routes = [
  { path: 'helpdesk/user/doubts/raise', component: DoubtcreateComponent },
  { path: 'helpdesk/user/doubts/list', component: UserDoubtListComponent },
  { path: 'helpdesk/chat/:sessionId :sender :receiver', component: HelpdeskChatPortalComponent },
  { path: 'helpdesk/academic-support/doubts/list', component: DoubtListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpdeskRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoubtListComponent } from './academic-support/doubt-list/doubt-list.component';
import { DoubtcreateComponent } from './helpdesk-user/doubt-create/doubt-create.component';
import { UserDoubtListComponent } from './helpdesk-user/user-doubt-list/user-doubt-list.component';

const routes: Routes = [
  { path: 'helpdesk/user/doubts/raise', component: DoubtcreateComponent },
  { path: 'helpdesk/academic-support/doubts/list', component: DoubtListComponent },
  { path: 'helpdesk/user/doubts/list', component: UserDoubtListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpdeskRoutingModule { }

import { NgModule } from '@angular/core';
import { NotePostComponent } from './user/note-post/note-post.component';
import { RouterModule, Routes } from '@angular/router';
import { NoteMynotesComponent } from './user/note-mynotes/note-mynotes.component';
import { AuthGuard } from '../user/auth-guard.service';
import { NoteViewComponent } from './user/note-view/note-view.component';

const routes: Routes = [
  {path: 'notes/post', component: NotePostComponent,canActivate: [AuthGuard]},
  {path: 'notes/mynotes', component: NoteMynotesComponent,canActivate: [AuthGuard]},
  {path: 'notes/view/:id', component: NoteViewComponent,canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteRoutingModule { }

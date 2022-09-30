import { NgModule } from '@angular/core';
import { NotePostComponent } from './user/note-post/note-post.component';
import { RouterModule, Routes } from '@angular/router';
import { NoteMynotesComponent } from './user/note-mynotes/note-mynotes.component';
import { AuthGuard } from '../user/auth-guard.service';
import { NoteViewComponent } from './user/note-view/note-view.component';
import { NoteEditComponent } from './user/note-edit/note-edit.component';
import { NotePublicComponent } from './user/note-public/note-public.component';
import { NotePublicViewComponent } from './user/note-public-view/note-public-view.component';

const routes: Routes = [
  {path: 'notes/post', component: NotePostComponent,canActivate: [AuthGuard]},
  {path: 'notes/mynotes', component: NoteMynotesComponent,canActivate: [AuthGuard]},
  {path: 'notes/view/:id', component: NoteViewComponent,canActivate: [AuthGuard]},
  {path: 'notes/edit/:id', component: NoteEditComponent, canActivate: [AuthGuard]},
  {path:'notes/public',component:NotePublicComponent},
  {path: 'notes/public/view/:id', component: NotePublicViewComponent}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteRoutingModule { }

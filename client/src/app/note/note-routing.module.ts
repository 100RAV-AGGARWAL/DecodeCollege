import { NgModule } from '@angular/core';
import { NotePostComponent } from './user/note-post/note-post.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'notes/post', component: NotePostComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteRoutingModule { }

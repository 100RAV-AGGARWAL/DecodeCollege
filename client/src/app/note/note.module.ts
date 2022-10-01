import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteRoutingModule } from './note-routing.module';
import { NotePostComponent } from './user/note-post/note-post.component';
import { NoteService } from './note.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { UtilityModule } from "../utility/utility.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { UserModule } from '../user/user.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NoteMynotesComponent } from './user/note-mynotes/note-mynotes.component';
import { NoteViewComponent } from './user/note-view/note-view.component';
import { NoteEditComponent } from './user/note-edit/note-edit.component';
import { NoteDeleteComponent } from './user/note-delete/note-delete.component';
import { NotePublicComponent } from './user/note-public/note-public.component';
import { NotePublicViewComponent } from './user/note-public-view/note-public-view.component';


@NgModule({
  declarations: [
    NotePostComponent,
    NoteMynotesComponent,
    NoteViewComponent,
    NoteEditComponent,
    NoteDeleteComponent,
    NotePublicComponent,
    NotePublicViewComponent
  ],
  imports: [
    CommonModule,
    NgxExtendedPdfViewerModule,
    NoteRoutingModule,
    CommonModule,
		FormsModule,
		ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatDividerModule,
    HttpClientModule,
    MatOptionModule,
    UtilityModule,
    MatSnackBarModule,
    UserModule,
    FileUploadModule,
  ],
  providers:[
    NoteService,
  ]
})
export class NoteModule { }

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
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { UtilityModule } from "../utility/utility.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { UserModule } from '../user/user.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    NotePostComponent
  ],
  imports: [
    CommonModule,
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

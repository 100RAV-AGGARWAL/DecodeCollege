import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { NoteService } from '../../note.service';
import { UserService } from 'src/app/user/user.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NoteDeleteComponent } from '../note-delete/note-delete.component';


@Component({
  selector: 'app-note-public',
  templateUrl: './note-public.component.html',
  styleUrls: ['./note-public.component.css']
})
export class NotePublicComponent implements OnInit {
  notesList:any = [];
  offset:number=0;
  limit:number=3;
  note={
    subName:"",
    subjectId:""
  }
  isListEmpty : Boolean = true;
  pageEvent: PageEvent = new PageEvent;
  displayedCols = ['name', 'subject', 'status','view'];

  constructor(private userService: UserService,private dialog: MatDialog, private noteService: NoteService, private _snackBar: SnackBarService) { 
   this.offset=0;
    this.fetchNotes();

  }

  ngOnInit(): void {
  }
  loadNextPage(): void {
    this.offset+=this.limit;
    this.fetchNotes();
  }
  fetchNotes() {
    this.noteService.PublicNotesList(this.offset, this.limit).subscribe(resp => {
      try {
        this.notesList.push(...JSON.parse(resp["notes"]));

        if(this.notesList.length != 0) {
					this.isListEmpty = false;
				} else {
					this.isListEmpty = true;
				}

      } catch (err) {
        this.isListEmpty = true;
        this._snackBar.openSnackBar('Notes not found.', 'X')
      }
    }, err => {
      if (err.status == 401) {
        this.userService.logoutUser();
      }
      this.isListEmpty = true;
      this._snackBar.openSnackBar('Notes not found.', 'X')
    });

   

  }
  
  

}

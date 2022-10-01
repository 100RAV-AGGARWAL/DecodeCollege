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
  notesList = [];
  note={
    subName:"",
    subjectId:""
  }
  isListEmpty : Boolean = true;
  pageEvent: PageEvent = new PageEvent;
  pagination = { limit: 5, total: 0, pageIndex: 0 }
  displayedCols = ['name', 'subject', 'status','view'];

  constructor(private userService: UserService,private dialog: MatDialog, private noteService: NoteService, private _snackBar: SnackBarService) { 
    this.pagination.total = 0;
    this.pagination.pageIndex = 0;
    this.fetchNotes();

  }

  ngOnInit(): void {
  }
  loadNextPage($event): void {
    this.pagination.limit = $event.pageSize;
    this.pagination.pageIndex = $event.pageIndex;
    this.fetchNotes();
  }
  fetchNotes() {
    this.noteService.PublicNotesList(this.pagination).subscribe(resp => {
      try {
        this.notesList = JSON.parse(resp["notes"]);
        this.pagination.total = resp["count"];

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

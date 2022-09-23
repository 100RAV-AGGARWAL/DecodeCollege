import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { NoteService } from '../../note.service';
import { UserService } from 'src/app/user/user.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NoteDeleteComponent } from '../note-delete/note-delete.component';

@Component({
  selector: 'app-note-mynotes',
  templateUrl: './note-mynotes.component.html',
  styleUrls: ['./note-mynotes.component.css']
})
export class NoteMynotesComponent implements OnInit {
  notesList = [/*{
    subName: "",
    subjectId: ""
  }*/];
  note={
    subName:"",
    subjectId:""
  }
  pageEvent: PageEvent = new PageEvent;
  pagination = { limit: 5, total: 0, pageIndex: 0 }
  displayedCols = ['name', 'subject', 'status', 'edit', 'view','delete'];
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
    this.noteService.NotesList(this.pagination).subscribe(resp => {
      try {
        this.notesList = JSON.parse(resp["notes"]);
        this.pagination.total = resp["total"];
      } catch (err) {
        this._snackBar.openSnackBar('Notes not found.', 'X')
      }
    }, err => {
      if (err.status == 401) {
        this.userService.logoutUser();
      }
      this._snackBar.openSnackBar('Notes not found.', 'X')
    });

   

  }
  openDialog(noteId: any, fileId: any): void {
		let body = { _id: noteId, fileId: fileId };
		const dialogRef = this.dialog.open(NoteDeleteComponent, {});

		dialogRef.afterClosed().subscribe(result => {
			if(!result || result != 'delete') {
				this._snackBar.openSnackBar('Keyword not matched. Note Deletion Failed', 'X')
				return;
			}
			this.noteService.deleteNote(body).subscribe(resp => {
				this._snackBar.openSnackBar('Note deleted successfully.', 'X');
				window.location.reload();
			}, err => {
				this._snackBar.openSnackBar('Note Deletion Failed', 'X')
				if (err.status == 401) {
					this.userService.logoutUser();
				}
			});
		});
	}
  
  
  



}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { NoteService } from '../../note.service';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.css']
})
export class NoteViewComponent implements OnInit {
  note : any;
  filePath = '';
  fileNameInFolder = '';
  constructor(private _snackBar: SnackBarService, private noteService: NoteService, private router: Router, private route: ActivatedRoute) { 
    this.route.params.subscribe(params => {
      this.noteService.getNotes(params['id']).subscribe(resp => {
        this.note = resp["note"];
        this.fileNameInFolder = this.note.filePath.replace(/^.*[\\\/]/, '');
        this.filePath = `assets/${this.fileNameInFolder}`;
      });
    });
  }

  ngOnInit(): void {
  }
 
}

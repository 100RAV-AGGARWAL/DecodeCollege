import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesLoadedEvent } from 'ngx-extended-pdf-viewer';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { NoteService } from '../../note.service';


@Component({
  selector: 'app-note-public-view',
  templateUrl: './note-public-view.component.html',
  styleUrls: ['./note-public-view.component.css']
})
export class NotePublicViewComponent implements OnInit {

  note : any;
  filePath = '';
  public height = '100vh';
  fileNameInFolder = '';
  constructor(private _snackBar: SnackBarService, private noteService: NoteService, private router: Router, private route: ActivatedRoute) { 
    this.route.params.subscribe(params => {
      this.noteService.getPublicNote(params['id']).subscribe(resp => {
        this.note = resp["note"];
        this.fileNameInFolder = this.note.filePath.replace(/^.*[\\\/]/, '');
        this.filePath = `assets/${this.fileNameInFolder}`;
      });
    });
  }

  ngOnInit(): void {
  }

  public onPagesLoaded(event: PagesLoadedEvent): void {
    const h = window.innerHeight - 64;
    this.height = `${h}px`;
  }

}

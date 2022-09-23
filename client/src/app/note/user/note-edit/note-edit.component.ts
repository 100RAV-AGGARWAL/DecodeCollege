import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import {  ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user/user.service';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { NoteService } from '../../note.service';
import { environment } from 'src/environments/environment';
const URL = environment.apiUrl + 'api/upload/file?itemType=note&fileId=';

@Component({
  selector: 'app-note-edit',
  templateUrl: './note-edit.component.html',
  styleUrls: ['./note-edit.component.css']
})
export class NoteEditComponent implements OnInit {
  updateEnabled;
  statusList = [
    { name: "private" },
    { name: "public" }
  ]
  note = {
    name: "",
    userId: "",
    fileId: "",
    filePath: "",
    
    subject: {
      _id: ""
    },
    status: ""
  }
  file;
  subjectList: any[] = [];
  public uploader: FileUploader = new FileUploader({
    url: URL + this.note.fileId,
    headers: [{
      name: "Authorization", value: this.userService.getJWTToken()!,
    }],
    itemAlias: 'file',
  });


  constructor(private userService: UserService, private noteService: NoteService,private router: Router,private route: ActivatedRoute,private toastr: ToastrService, private _snackBar: SnackBarService) {
    this.noteService.getSubject().subscribe((resp: any) => {
      try {
        this.subjectList = JSON.parse(resp["subject"]);
        this.route.params.subscribe(params => {
          this.noteService.getNotes(params['id']).subscribe(resp => {
            this.note = resp["note"];
           });
        });
      }
      catch (err) {
        this._snackBar.openSnackBar('Unable to load categories.', 'X')
      }
    }, err => {
      this._snackBar.openSnackBar('Unable to load categories.', 'X')
    });
    this.updateEnabled = true;
   }

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.updateEnabled = false;
      this.toastr.show('File uploading...');
      this.uploader.setOptions({
        url: URL + this.note.fileId,
      });
    };
    this.uploader.onCompleteItem = (item: any, resp: string, status: any) => {
      console.log('Uploaded File Details:', item);
      this.toastr.success('File successfully uploaded!');

      let rsp = JSON.parse(resp);
      this.file = rsp["file"];
      this.note.fileId = this.file._id;
      this.note.filePath = this.file.filePath;
      this.updateEnabled = true;
    };
  }
  updateNote(){
    if(!this.note.name){
      this._snackBar.openSnackBar("File Name is Required","X");
      return;
    }
    if (!this.updateEnabled) {
      this._snackBar.openSnackBar("File upload in progress. Please wait.", "X");
      return;
    }

    this.noteService.updateNotes(this.note).subscribe(resp => {
      this._snackBar.openSnackBar('Notes Updated.', 'X');
		//	this.router.navigate(['/notes/myNotes']);

    }, err => {
      this._snackBar.openSnackBar(err.error.error, 'X')
    });

  }


}

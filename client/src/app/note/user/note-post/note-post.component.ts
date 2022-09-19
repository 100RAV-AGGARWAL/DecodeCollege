import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user/user.service';
import { environment } from 'src/environments/environment';
import { SnackBarService } from '../../../utility/snackbar/snackbar.component';
import { NoteService } from '../../note.service';
const URL = environment.apiUrl + 'api/upload/file?itemType=note&fileId=';
@Component({
  selector: 'app-note-post',
  templateUrl: './note-post.component.html',
  styleUrls: ['./note-post.component.css']
})

export class NotePostComponent implements OnInit {
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


  constructor(private _snackBar: SnackBarService, private noteService: NoteService, private toastr: ToastrService, private userService: UserService) {
    this.noteService.getSubject().subscribe((resp: any) => {
      try {
        this.subjectList = JSON.parse(resp["subject"]);
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

  saveNote() {
    if (!this.updateEnabled) {
      this._snackBar.openSnackBar("File upload in progress. Please wait.", "X");
      return;
    }

    this.noteService.saveNotes(this.note).subscribe(resp => {
      this._snackBar.openSnackBar('Note Created.', 'X')
    }, err => {
      this._snackBar.openSnackBar(err.error.error, 'X')
    });

  }

}

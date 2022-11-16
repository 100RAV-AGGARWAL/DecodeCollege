import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user/user.service';
import { environment } from 'src/environments/environment';
import { SnackBarService } from '../../../utility/snackbar/snackbar.component';
import { AssignmentService } from '../../assignment.service';

const URL = environment.apiUrl + 'api/upload/file?itemType=assignment&fileId=';
@Component({
  selector: 'app-assignment-post',
  templateUrl: './assignment-post.component.html',
  styleUrls: ['./assignment-post.component.css'],
})
export class AssignmentPostComponent implements OnInit {
  updateEnabled;
  assignment = {
    id: "",
    name: "",
    deadline: "",
    subject: { _id: "" },
    fileId: "",
    driveFileId: ""
  }
  file;
  subjectList: any[] = [];

  public uploader: FileUploader = new FileUploader({
    url: URL + this.assignment.fileId,
    headers: [{
      name: "Authorization", value: this.userService.getJWTToken()!,
    }],
    itemAlias: 'file',
  });

  constructor(private _snackBar: SnackBarService, private assignmentService: AssignmentService, private toastr: ToastrService, private userService: UserService) {
    this.assignmentService.getSubject().subscribe((resp: any) => {
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

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.updateEnabled = false;
      this.toastr.show('File uploading...');
      this.uploader.setOptions({
        url: URL + this.assignment.fileId,
      });
    };
    this.uploader.onCompleteItem = (item: any, resp: string, status: any) => {
      console.log('Uploaded File Details:', item);
      this.toastr.success('File successfully uploaded!');

      let rsp = JSON.parse(resp);
      this.file = rsp["file"];
      this.assignment.fileId = this.file._id;
      this.assignment.driveFileId = this.file.driveFileId;
      this.updateEnabled = true;
    };
  }

  saveAssignment() {
    if (!this.updateEnabled) {
      this._snackBar.openSnackBar("File upload in progress. Please wait.", "X");
      return;
    }

    this.assignmentService.saveAssignments(this.assignment).subscribe(resp => {
      this._snackBar.openSnackBar('Assignment Created.', 'X')
    }, err => {
      this._snackBar.openSnackBar(err.error.error, 'X')
    });
  }

}

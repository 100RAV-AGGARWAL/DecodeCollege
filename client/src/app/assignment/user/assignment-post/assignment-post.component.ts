import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '../../../utility/snackbar/snackbar.component';
import { AssignmentService } from '../../assignment.service';

@Component({
  selector: 'app-assignment-post',
  templateUrl: './assignment-post.component.html',
  styleUrls: ['./assignment-post.component.css']
})
export class AssignmentPostComponent implements OnInit {
  updateEnabled;
  assignment = {
    id: "",
    name: "",
    deadline: "",
    subject: { _id: "" },
    fileId: "",
    filePath: ""
  }
  file;
  subjectList : any[] = [];
  constructor(private _snackBar: SnackBarService, private assignmentService: AssignmentService) {
    this.assignmentService.getSubject().subscribe((resp:any) => {
      try {
        this.subjectList = JSON.parse(resp["subject"]);
      }
      catch (err) {
        this._snackBar.openSnackBar('Unable to load categories.', 'X')
      }
    }, err => {
      this._snackBar.openSnackBar('Unable to load categories.', 'X')
    });
    this.file = {
      _id: "",
      filePath: "",
      key: "",
    };
    this.updateEnabled = true;
  }

  ngOnInit(): void {
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
  onFileChanged($event) {
    const file = $event.target.files[0]
    this.updateEnabled = false;

    this.assignmentService.uploadFile(file, this.file._id).subscribe((resp:any) => {
      this.file = resp["file"];
      this.assignment.fileId = this.file._id;
      this.assignment.filePath = this.file.filePath;
      this._snackBar.openSnackBar("File uploaded", "X");
      this.updateEnabled = true;
    }, err => {
      this._snackBar.openSnackBar("Could not upload File. " + err.msg, "X");
      this.updateEnabled = true;
    });
  }

}

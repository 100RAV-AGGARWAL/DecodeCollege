import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user/user.service';
import { environment } from 'src/environments/environment';
import { SnackBarService } from '../../../utility/snackbar/snackbar.component';
import { AssignmentService } from '../../assignment.service';
import { DatePipe } from '@angular/common';

const URL = environment.apiUrl + 'api/upload/file?itemType=assignment&fileId=';
@Component({
  selector: 'app-assignment-edit',
  templateUrl: './assignment-edit.component.html',
  styleUrls: ['./assignment-edit.component.css']
})
export class AssignmentEditComponent implements OnInit {
  updateEnabled = true;
  assignment = {
    id: "",
    name: "",
    deadline: "",
    subject: { _id: "" },
    fileId: "",
    filePath: ""
  }
  file;
  subjectList: any[] = [];
  private sub: any;

  public uploader: FileUploader = new FileUploader({
    url: URL + this.assignment.fileId,
    headers: [{
      name: "Authorization", value: this.userService.getJWTToken()!,
    }],
    itemAlias: 'file',
  });
  deadline: any;

  constructor(private _snackBar: SnackBarService, private assignmentService: AssignmentService, private toastr: ToastrService, private userService: UserService, private route: ActivatedRoute, private datePipe: DatePipe, private router: Router) {
    this.assignmentService.getSubject().subscribe((resp: any) => {
      try {
        this.subjectList = JSON.parse(resp["subject"]);
        this.sub = this.route.params.subscribe(params => {
            
          this.assignmentService.getAssignment(params['id']).subscribe(resp => {
              this.assignment = resp["assignment"];
              this.deadline = this.datePipe.transform(new Date(this.assignment.deadline), 'yyyy-MM-dd')!;
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
      this.assignment.filePath = this.file.filePath;
      this.updateEnabled = true;
    };
  }

  updateAssignment() {
    if (!this.updateEnabled) {
      this._snackBar.openSnackBar("File upload in progress. Please wait.", "X");
      return;
    }

    this.assignment.deadline = this.deadline.toString();

    this.assignmentService.updateAssignments(this.assignment).subscribe(resp => {
      this._snackBar.openSnackBar('Assignment Updated.', 'X');
			this.router.navigate(['/assignment/myAssignments']);

    }, err => {
      this._snackBar.openSnackBar(err.error.error, 'X')
    });
  }

}

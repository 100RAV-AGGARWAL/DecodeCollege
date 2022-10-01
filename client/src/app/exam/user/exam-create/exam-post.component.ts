import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { SnackBarService } from '../../../utility/snackbar/snackbar.component';
import { ExamService } from '../../exam.service';

@Component({
  selector: 'app-exam-post',
  templateUrl: './exam-post.component.html',
  styleUrls: ['./exam-post.component.css'],
})
export class ExamPostComponent implements OnInit {
  updateEnabled;
  exam = {
    id: "",
    name: "",
    date: "",
    subject: { _id: "" },
    semester: { _id: "" },
  }
  subjectList: any[] = [];


  constructor(private _snackBar: SnackBarService, private examService: ExamService, private userService: UserService) {
    this.examService.getSubject().subscribe((resp: any) => {
      try {
        this.subjectList = JSON.parse(resp["subject"]);
      }
      catch (err) {
        this._snackBar.openSnackBar('Unable to load categories.', 'X')
      }
    }, err => {
      this._snackBar.openSnackBar('Unable to load categories.', 'X')
    });

  }

  ngOnInit() {
  }

  saveAssignment() {

    this.examService.saveExam(this.exam).subscribe(resp => {
      this._snackBar.openSnackBar('Exam Created.', 'X')
    }, err => {
      this._snackBar.openSnackBar(err.error.error, 'X')
    });
  }

}

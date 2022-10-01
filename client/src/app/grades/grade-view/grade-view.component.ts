import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { empty } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
import { environment } from 'src/environments/environment';
import { SnackBarService } from '../../utility/snackbar/snackbar.component';
import { GradesService } from '../grades.service';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-grade-view',
  templateUrl: './grade-view.component.html',
  styleUrls: ['./grade-view.component.css']
})
export class GradeViewComponent implements OnInit {
  // semestersubjectList: any[] = [];
  semeseterList: any[] = [];
  constructor(private _snackBar: SnackBarService, private gradeservice: GradesService, private toastr: ToastrService, private userService: UserService, private router: Router,) {
    this.gradeservice.getSemester().subscribe((resp: any) => {
      try {
        this.semeseterList = JSON.parse(resp["semester"]);
        console.log(this.semeseterList)
        for (let index = 0; index < this.semeseterList.length; index++) {

          // let sem = {
          //   sem: this.semeseterList[index].sem_no
          // }
          // console.log(sem);
          // let subjectList:any[]=[];
          // let subjectList=this.getSubjects(sem);
          // console.log(subjectList);
        }
      }
      catch (err) {
        this._snackBar.openSnackBar('Unable to load categories.', 'X')
      }
    }, err => {
      this._snackBar.openSnackBar('Unable to load categories.', 'X')
    });

  }
//   getSubjects( sem) {

//     this.gradeservice.getSubject(sem).subscribe((resp: any) => {

//       try {
//         let subjectList = JSON.parse(resp["subject"]);
//         console.log(subjectList);
// return subjectList;

//       }
//       catch (err) {
//         this._snackBar.openSnackBar('Unable to load categories.', 'X')
//       }
//     }, err => {
//       this._snackBar.openSnackBar('Unable to load categories.', 'X')
//     });
//   }
  ngOnInit(): void {
  }

}

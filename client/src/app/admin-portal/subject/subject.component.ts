import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { AdminPortalService } from '../admin-portal.service';
@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  subject={
    name:"",
    semester:1,
    credits:5,
    subjectcode:""

  }
  semesterList=[
    {no:1},
    {no:2},
    {no:3},
    {no:4},
    {no:5},
    {no:6},
    {no:7},
    {no:8}
    ]
  constructor(private adminService: AdminPortalService, private _snackBar: SnackBarService) {
   
   }

  ngOnInit(): void {
  }
  saveSubject(){
    this.adminService.createSubject(this.subject).subscribe(resp => {
      this._snackBar.openSnackBar('Subject Created.', 'X')
    }, err => {
      this._snackBar.openSnackBar(err, 'X')
    });
  }
}

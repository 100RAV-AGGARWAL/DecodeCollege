import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { ExamService } from '../../exam.service';

  

@Component({
	selector: 'app-exam-list',
	templateUrl: './exam-list.component.html',
	styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements AfterViewInit {
	examList =[];
	exam={
	  name: "",
	  subject: "",
	  semester: null,
	  date: null,
	  status: ""
  }

  isListEmpty : Boolean = true;
  pageEvent: PageEvent = new PageEvent;
  pagination = { limit: 5, total: 0, pageIndex: 0 }
  displayedCols = ['name', 'status',  'view'];

	

	constructor(private examService: ExamService, private userService: UserService, private _snackBar: SnackBarService, private dialog: MatDialog, private router: Router) {
		this.pagination.total = 0;
		this.pagination.pageIndex = 0;
		this.fetchExams();
	}
	ngOnInit() {

	}

	ngAfterViewInit(): void {
	}

	loadNextPage($event): void {
		this.pagination.limit = $event.pageSize;
		this.pagination.pageIndex = $event.pageIndex;
		this.fetchExams();
	}

	fetchExams() {
		this.examService.getMyExams(this.pagination).subscribe(resp => {
			try {
			  this.examList = JSON.parse(resp["exams"]);
			  console.log(this.examList);
			  this.pagination.total = resp["total"];
	  
			  if(this.examList.length != 0) {
						  this.isListEmpty = false;
					  } else {
						  this.isListEmpty = true;
					  }
	  
			} catch (err) {
			  this.isListEmpty = true;
			  this._snackBar.openSnackBar('Exam not found.', 'X')
			}
		  }, err => {
			if (err.status == 401) {
			  this.userService.logoutUser();
			}
			this.isListEmpty = true;
			this._snackBar.openSnackBar('Exam not found.', 'X')
		  });
	  
		 
	  
	}

	
}

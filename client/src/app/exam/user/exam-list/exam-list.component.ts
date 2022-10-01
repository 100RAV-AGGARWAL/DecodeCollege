import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { ExamService } from '../../exam.service';

interface Exam {
	name: any;
	subject: any;
	semester: any;
	deadline: any;
	status: any;
}

@Component({
	selector: 'app-exam-list',
	templateUrl: './exam-list.component.html',
	styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements AfterViewInit {
	examList: Exam[] = [];
	allExamList: Exam[] = [];

	pageEvent: PageEvent = new PageEvent;
	pagination = { limit: 5, total: 0, pageIndex: 0 }
	displayedCols = ['name', 'subject', 'date','semester', 'status', 'edit', 'view', 'delete'];
	isListEmpty: Boolean = false;

	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(private examService: ExamService, private userService: UserService, private _snackBar: SnackBarService, private dialog: MatDialog, private router: Router) {
		this.pagination.total = 0;
		this.pagination.pageIndex = 0;
	}
	ngOnInit() {

	}

	ngAfterViewInit(): void {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					return this.fetchExams();
				}),
				map((data: any) => {
					this.isLoadingResults = false;
					this.isRateLimitReached = data === null;

					if (data === null) {
						return [];
					}

					this.resultsLength = data.total;
					return data.assignments;
				}),
			)
			.subscribe(data => (this.examList = data));
	}

	loadNextPage($event): void {
		this.pagination.limit = $event.pageSize;
		this.pagination.pageIndex = $event.pageIndex;
		this.fetchExams();
	}

	fetchExams() {
		this.examService.getMyExams(this.pagination, this.sort.active, this.sort.direction).subscribe(resp => {
			try {
				this.examList = JSON.parse(resp["assignment"]);
				this.allExamList = JSON.parse(resp["assignment"]);
				this.pagination.total = resp["total"];

				if (this.examList.length != 0) {
					this.isListEmpty = false;
				} else {
					this.isListEmpty = true;
				}

				return observableOf(this.examList);
			} catch (err) {
				this.isListEmpty = true;
				this._snackBar.openSnackBar('Assignments not found.', 'X');
				return observableOf([]);
			}
		}, err => {
			if (err.status == 401) {
				this.userService.logoutUser();
			}
			this.isListEmpty = true;
			this._snackBar.openSnackBar('Assignments not found.', 'X')
			return observableOf([]);
		});

		return observableOf([]);
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		if(filterValue === '' ) {
			this.examList=this.allExamList;
		} 
		else {
		  this.examList = this.allExamList.filter((exam) => exam.subject.name.includes(filterValue));
		}
	 }
   
}

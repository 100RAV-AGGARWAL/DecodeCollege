import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { AssignmentService } from '../../assignment.service';
import { AssignmentDeleteComponent } from '../assignment-delete/assignment-delete.component';

interface Assignment {
	name: any;
	subject: any;
	deadline: any;
	status: any;
}

@Component({
	selector: 'app-assignment-myassignments',
	templateUrl: './assignment-myassignments.component.html',
	styleUrls: ['./assignment-myassignments.component.css']
})
export class AssignmentMyassignmentsComponent implements AfterViewInit {
	assignmentList: Assignment[] = [];
	allAssignmentList: Assignment[] = [];

	pageEvent: PageEvent = new PageEvent;
	pagination = { limit: 5, total: 0, pageIndex: 0 }
	displayedCols = ['name', 'subject', 'deadline', 'status', 'edit', 'view', 'delete'];
	isListEmpty: Boolean = false;

	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(private assignmentService: AssignmentService, private userService: UserService, private _snackBar: SnackBarService, private dialog: MatDialog, private router: Router) {
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
					return this.fetchAssignments();
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
			.subscribe(data => (this.assignmentList = data));
	}

	loadNextPage($event): void {
		this.pagination.limit = $event.pageSize;
		this.pagination.pageIndex = $event.pageIndex;
		this.fetchAssignments();
	}

	fetchAssignments() {
		this.assignmentService.getMyAssignment(this.pagination, this.sort.active, this.sort.direction).subscribe(resp => {
			try {
				this.assignmentList = JSON.parse(resp["assignment"]);
				this.allAssignmentList = JSON.parse(resp["assignment"]);
				this.pagination.total = resp["total"];

				if (this.assignmentList.length != 0) {
					this.isListEmpty = false;
				} else {
					this.isListEmpty = true;
				}

				return observableOf(this.assignmentList);
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

	openDialog(assignmentId: any, fileId: any): void {
		let body = { assignmentId: assignmentId, fileId: fileId };
		const dialogRef = this.dialog.open(AssignmentDeleteComponent, {});

		dialogRef.afterClosed().subscribe(result => {
			if (!result || result != 'delete') {
				this._snackBar.openSnackBar('Keyword not matched. Assignment Deletion Failed', 'X')
				return;
			}
			this.assignmentService.deleteAssignment(body).subscribe(resp => {
				this._snackBar.openSnackBar('Assignment deleted successfully.', 'X');
				window.location.reload();
			}, err => {
				this._snackBar.openSnackBar('Assignment Deletion Failed', 'X')
				if (err.status == 401) {
					this.userService.logoutUser();
				}
			});
		});
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		if(filterValue === '' ) {
			this.assignmentList=this.allAssignmentList;
		} 
		else {
		  this.assignmentList = this.allAssignmentList.filter((assignment) => assignment.subject.name.includes(filterValue));
		}
	 }
   
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { AssignmentService } from '../../assignment.service';
import { AssignmentDeleteComponent } from '../assignment-delete/assignment-delete.component';

@Component({
	selector: 'app-assignment-myassignments',
	templateUrl: './assignment-myassignments.component.html',
	styleUrls: ['./assignment-myassignments.component.css']
})
export class AssignmentMyassignmentsComponent implements OnInit {
	assignmentList = []
	pageEvent: PageEvent = new PageEvent;
	pagination = { limit: 5, total: 0, pageIndex: 0 }
	displayedCols = ['name', 'subject', 'deadline', 'status', 'edit', 'view', 'delete'];

	constructor(private assignmentService: AssignmentService, private userService: UserService, private _snackBar: SnackBarService, private dialog: MatDialog, private router: Router) {
		this.pagination.total = 0;
		this.pagination.pageIndex = 0;
		this.fetchAssignments();
	}
	ngOnInit() {

	}

	loadNextPage($event): void {
		this.pagination.limit = $event.pageSize;
		this.pagination.pageIndex = $event.pageIndex;
		this.fetchAssignments();
	}

	fetchAssignments() {
		this.assignmentService.getMyAssignment(this.pagination).subscribe(resp => {
			try {
				this.assignmentList = JSON.parse(resp["assignment"]);
				this.pagination.total = resp["total"];
			} catch (err) {
				this._snackBar.openSnackBar('Assignments not found.', 'X')
			}
		}, err => {
			if (err.status == 401) {
				this.userService.logoutUser();
			}
			this._snackBar.openSnackBar('Assignments not found.', 'X')
		});
	}

	openDialog(assignmentId: any, fileId: any): void {
		let body = { assignmentId: assignmentId, fileId: fileId };
		const dialogRef = this.dialog.open(AssignmentDeleteComponent, {});

		dialogRef.afterClosed().subscribe(result => {
			if(!result || result != 'delete') {
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


}

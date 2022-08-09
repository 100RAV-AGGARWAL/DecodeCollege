import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { UserService } from 'src/app/user/user.service';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { AssignmentService } from '../../assignment.service';

@Component({
  selector: 'app-assignment-myassignments',
  templateUrl: './assignment-myassignments.component.html',
  styleUrls: ['./assignment-myassignments.component.css']
})
export class AssignmentMyassignmentsComponent implements OnInit {
  assignmentList = []
	pageEvent: PageEvent = new PageEvent;
	pagination = { limit: 5, total: 0, pageIndex: 0 }
  displayedCols = ['name', 'subject', 'deadline', 'status', 'edit', 'view'];

	constructor(private assignmentService: AssignmentService, private userService: UserService, private _snackBar: SnackBarService) {
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

}

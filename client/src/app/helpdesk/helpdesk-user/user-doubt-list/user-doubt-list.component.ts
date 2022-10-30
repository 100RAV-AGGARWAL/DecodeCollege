import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { HelpdeskService } from '../../helpdesk.service';

interface UserDoubt {
  _id: any;
  topic: any;
  description: any;
  status: any;
  createdAt: any;
}

@Component({
  selector: 'app-user-doubt-list',
  templateUrl: './user-doubt-list.component.html',
  styleUrls: ['./user-doubt-list.component.css']
})
export class UserDoubtListComponent implements OnInit {
	doubtList: UserDoubt[] = [];
	allDoubtList: UserDoubt[] = [];

	pageEvent: PageEvent = new PageEvent;
	pagination = { limit: 5, total: 0, pageIndex: 0 }
	displayedCols = ['description', 'topic', 'status', 'createdAt', 'solve'];
	isListEmpty: Boolean = false;

	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(private helpdeskService: HelpdeskService, private userService: UserService, private _snackBar: SnackBarService, private router: Router) {
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
					return this.fetchDoubts();
				}),
				map((data: any) => {
					this.isLoadingResults = false;
					this.isRateLimitReached = data === null;

					if (data === null) {
						return [];
					}

					this.resultsLength = data.total;
					return data.doubts;
				}),
			)
			.subscribe(data => (this.doubtList = data));
	}

	loadNextPage($event): void {
		this.pagination.limit = $event.pageSize;
		this.pagination.pageIndex = $event.pageIndex;
		this.fetchDoubts();
	}

	fetchDoubts() {
		this.helpdeskService.getUserDoubtList(this.pagination, this.sort.active, this.sort.direction).subscribe(resp => {
			try {
				this.doubtList = JSON.parse(resp["doubt"]) as UserDoubt[];
				this.allDoubtList = JSON.parse(resp["doubt"]) as UserDoubt[];
				this.pagination.total = resp["total"];

				if (this.doubtList.length != 0) {
					this.isListEmpty = false;
				} else {
					this.isListEmpty = true;
				}

				return observableOf(this.doubtList);
			} catch (err) {
				this.isListEmpty = true;
				this._snackBar.openSnackBar('Doubts not found.', 'X');
				return observableOf([]);
			}
		}, err => {
			if (err.status == 401) {
				this.userService.logoutUser();
			}
			this.isListEmpty = true;
			this._snackBar.openSnackBar('Doubts not found.', 'X')
			return observableOf([]);
		});

		return observableOf([]);
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		if(filterValue === '' ) {
			this.doubtList=this.allDoubtList;
		} 
		else {
		  this.doubtList = this.allDoubtList.filter((doubt) => doubt.description.includes(filterValue));
		}
	 }

	solveDoubt(doubtId: any) {
		this.helpdeskService.solveDoubt(doubtId).subscribe(resp => {
			this._snackBar.openSnackBar('Doubt solved successfully.', 'X');
			this.fetchDoubts();
		});
	}

   
}

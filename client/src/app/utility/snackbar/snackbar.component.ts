import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SnackBarService {

	constructor(private _snackBar: MatSnackBar) { }

	public openSnackBar(message: string, action: string) {
		this._snackBar.open(message, action, {
			duration: 3000,
		});
	}

}

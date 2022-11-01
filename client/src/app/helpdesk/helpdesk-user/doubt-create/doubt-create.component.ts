import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { HelpdeskService } from '../../helpdesk.service';

@Component({
  selector: 'app-doubt-create',
  templateUrl: './doubt-create.component.html',
  styleUrls: ['./doubt-create.component.css']
})
export class DoubtcreateComponent implements OnInit {
  doubt = {
    id: "",
    description: "",
    topic: "customer-support"
  }

  topicList = ["customer-support", "academic-support"];

  constructor(private _snackBar: SnackBarService, private helpdeskService: HelpdeskService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  createDoubt() {
    this.helpdeskService.createDoubt(this.doubt).subscribe(resp => {
      this._snackBar.openSnackBar('Doubt Raised', 'X');
      this.router.navigate(['/dashboard']);
      // this.router.navigate(['/helpdesk/user/doubts/list']);
    }, err => {
      this._snackBar.openSnackBar(err.error.error, 'X')
    });
  }

}

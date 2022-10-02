import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  logoutUser() {
    this.userService.logoutUser();
  }
  handleTop(){
    window.scrollTo({ top: 10000, behavior: 'smooth' });

  }
  isLoggedIn() {
		var isLogged = this.userService.isLoggedIn();
		return isLogged;
	}
}

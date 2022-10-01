import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-close-tab',
  templateUrl: './close-tab.component.html',
  styleUrls: ['./close-tab.component.css']
})
export class CloseTabComponent implements OnInit {

  // time: number = 30;
  // totaltime: number = 60000;
  // fetchtime: number;
  // temp: number = 0;
  
  

  constructor() {
    // this.fetchtime = Number(localStorage.getItem('time'));
    // this.temp = this.totaltime - this.fetchtime;
    // this.time = this.temp / 1000;
    // let interval = setInterval(() => {
    //   if (this.time == 0) {
    //     clearInterval(interval);
    //   } else {
    //     this.time--;
    //   }
    // }, 1000)


  }

  ngOnInit(): void {
  }
  // show(){
  //    window.location.reload();
  // }

}

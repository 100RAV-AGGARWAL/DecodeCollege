import { Component, HostListener, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'client';
  isTimeOut = false;
  timepassed: string = ''
  num: number = 0
  count: number = 0
  count2: number = 0
  limit: number = 300000;
  upperLimit: number = 330000; 
  timeLeft: number = this.limit
  timeLeft2: number = this.upperLimit - this.limit;
  
  ngOnDestroy() {
    localStorage.removeItem('time');
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.num = this.num + this.count + this.count2;
    this.timepassed = (this.num).toString();
    localStorage.setItem('time', this.timepassed);
    console.log(this.timepassed);
  }

  constructor() {
    //Set Time
    if (!localStorage.getItem('time')) {
      localStorage.setItem('time', '0');
    }
    //Fetch Time 
    this.num = Number(localStorage.getItem('time'));

    //compare it from given limit
    if (this.num < this.limit) {
      this.isTimeOut = false;
      this.timeLeft = this.limit - this.num;
    }
    else if (this.num >= this.limit && this.num < this.upperLimit) {
      this.timeLeft = 0;
      this.timeLeft2 = this.upperLimit - this.num;
    }
    else if (this.num >= this.upperLimit) {
      localStorage.setItem('time', '0');
      this.num = 0;

    }

    let IntervalId = setInterval(() => {
      if (this.count != this.timeLeft) {
        this.count += 1000;
        console.log(this.count);
        console.log(this.timeLeft);
      }
      else {
        this.isTimeOut = true;
        this.displayscreen();
        clearInterval(IntervalId);
      }
    }, 1000);
  }

  displayscreen() {
    if (this.isTimeOut) {
      let Intid = setInterval(() => {
        if (this.count2 != this.timeLeft2) {
          this.count2 += 1000;
        } else {
          this.isTimeOut = false;
          localStorage.setItem('time', '0');
          window.location.reload();
          clearInterval(Intid);
        }
      }, 1000)
    }
  }
}

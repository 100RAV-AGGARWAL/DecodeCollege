import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'client';
  isTimeOut=false;
  constructor(){
    setTimeout(()=>{this.isTimeOut=true,this.displayscreen()},10000);
   
  }
  displayscreen(){
  if(this.isTimeOut){
    setTimeout(()=>{this.isTimeOut=false},5000);
  }
}
}

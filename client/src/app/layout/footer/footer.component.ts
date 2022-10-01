import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }
  handletop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
   
  }
  ngOnInit(): void {
  }

}

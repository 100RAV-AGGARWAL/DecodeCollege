import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  searchText = '';
  searchResults: any;
  alt_img_link = "assets/img/course-1.jpg";
  start = 1;

  constructor(private coursesService: CoursesService) {
    this.start = 1;
  }

  ngOnInit(): void {
  }

  getSearchResults() {
    this.coursesService.fetchSearchResults(this.searchText, this.start).subscribe(resp => {
      this.searchResults = resp['items'];
      this.start += 10;
    })
  }

  // checkIfImageAvailable(course) {
  //   if(course?.pagemap?.cse_image?.[0]?.src != null) {
  //     return true;
  //   }
  //   return false;
  // }

}

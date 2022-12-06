import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesLoadedEvent } from 'ngx-extended-pdf-viewer';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { AssignmentService } from '../../assignment.service';

@Component({
  selector: 'app-assignment-view',
  templateUrl: './assignment-view.component.html',
  styleUrls: ['./assignment-view.component.css']
})
export class AssignmentViewComponent implements OnInit{
  assignment : any;
  filePath = '';
  fileNameInFolder = '';
  private sub: any;
  public height = '100vh';

  constructor(private _snackBar: SnackBarService, private assignmentService: AssignmentService, private router: Router, private route: ActivatedRoute) { 
    this.sub = this.route.params.subscribe(params => {
      this.assignmentService.getAssignment(params['id']).subscribe(resp => {
        this.assignment = resp["assignment"];
        // this.fileNameInFolder = this.assignment.filePath.replace(/^.*[\\\/]/, '');
        // this.filePath = `assets/${this.fileNameInFolder}`;
        // this.filePath = `https://www.googleapis.com/drive/v3/files/${this.assignment.driveFileId}`;
        // this.readFile(this.assignment.file);
        this.filePath = this.assignment.file.data.webViewLink;
      });
    });
  }

  ngOnInit(): void {
  }

  public onPagesLoaded(event: PagesLoadedEvent): void {
    const h = window.innerHeight - 64;
    this.height = `${h}px`;
  }

  // readFile(file: any) {
  //   let reader = new FileReader();

  //   reader.onload = (event: any) => {
  //     this.filePath = event.target.result;
  //   };

  //   reader.onerror = (event: any) => {
  //     console.log("File could not be read: " + event.target.error.code);
  //   };

  //   reader.readAsDataURL(file.data);
  // }
}

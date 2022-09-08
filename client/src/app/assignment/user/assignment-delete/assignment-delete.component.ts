import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-assignment-delete',
  templateUrl: './assignment-delete.component.html',
  styleUrls: ['./assignment-delete.component.css']
})
export class AssignmentDeleteComponent implements OnInit {

  reason='';
  constructor(public dialogRef: MatDialogRef<AssignmentDeleteComponent>) {}

  ngOnInit(): void {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlagiarismRemoverRoutingModule } from './plagiarism-remover-routing.module';
import { PlagiarismRemoverComponent } from './plagiarism-remover/plagiarism-remover.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    PlagiarismRemoverComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    PlagiarismRemoverRoutingModule
  ]
})
export class PlagiarismRemoverModule { }

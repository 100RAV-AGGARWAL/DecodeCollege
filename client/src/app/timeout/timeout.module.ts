import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeoutRoutingModule } from './timeout-routing.module';
import { CloseTabComponent } from './close-tab/close-tab.component';


@NgModule({
  declarations: [
    CloseTabComponent
  ],
  imports: [
    CommonModule,
    TimeoutRoutingModule
  ],
  exports:[
    CloseTabComponent
  ]
})
export class TimeoutModule { }

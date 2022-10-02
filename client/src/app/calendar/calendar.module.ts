import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DateAdapter, CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
// import { CalendarService } from './calendar.service';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarHeaderComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgbModalModule
  ],
  exports: [CalendarComponent]
})
export class CalendarComponentModule { }

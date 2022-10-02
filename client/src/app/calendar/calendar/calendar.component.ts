import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { AssignmentService } from 'src/app/assignment/assignment.service';
import { ExamService } from 'src/app/exam/exam.service';
import { Router } from '@angular/router';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      a11yLabel: 'View',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('View', event);
      }
    }
  ]

  constructor(private modal: NgbModal, private assignmentService: AssignmentService, private examService: ExamService, private router: Router) {
    this.fetchData();
  }

  fetchData() {
    let month = this.viewDate.getMonth() + 1;
    let year = this.viewDate.getFullYear();

    this.assignmentService.getAssignmentByMonth(month, year).subscribe((data) => {
      let assignments = JSON.parse(data['assignment']);

      if (assignments.length > 0) {
        assignments.forEach((assignment: any) => {
          this.events.push({
            start: new Date(assignment.deadline),
            title: 'Assignment',
            color: colors['blue'],
            actions: this.actions,
            allDay: true,
            id: assignment._id,
          });
        });
      }
    });

    this.examService.getExamsByMonth(month, year).subscribe((data) => {
      let exams = JSON.parse(data['exams']);

      if (exams.length > 0) {
        exams.forEach((exam: any) => {
          this.events.push({
            start: new Date(exam.date),
            title: 'Exam',
            color: colors['red'],
            actions: this.actions,
            allDay: true,
            id: exam._id,
          });
        });
      }
    });
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.fetchData();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if (action == 'Assignment') {
      this.router.navigate(['/assignment/view', event.id]);
    }
    if (action == 'Exam') {
      this.router.navigate(['/exam/view', event.id]);
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

}

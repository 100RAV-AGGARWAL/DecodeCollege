import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentMyassignmentsComponent } from './assignment-myassignments.component';

describe('AssignmentMyassignmentsComponent', () => {
  let component: AssignmentMyassignmentsComponent;
  let fixture: ComponentFixture<AssignmentMyassignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentMyassignmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentMyassignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

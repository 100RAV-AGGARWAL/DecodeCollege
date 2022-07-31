import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentPostComponent } from './assignment-post.component';

describe('AssignmentPostComponent', () => {
  let component: AssignmentPostComponent;
  let fixture: ComponentFixture<AssignmentPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

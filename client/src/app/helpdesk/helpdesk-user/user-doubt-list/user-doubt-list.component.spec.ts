import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDoubtListComponent } from './user-doubt-list.component';

describe('UserDoubtListComponent', () => {
  let component: UserDoubtListComponent;
  let fixture: ComponentFixture<UserDoubtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDoubtListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDoubtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

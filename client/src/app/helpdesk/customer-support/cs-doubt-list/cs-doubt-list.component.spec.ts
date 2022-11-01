import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsDoubtListComponent } from './cs-doubt-list.component';

describe('CsDoubtListComponent', () => {
  let component: CsDoubtListComponent;
  let fixture: ComponentFixture<CsDoubtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsDoubtListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsDoubtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

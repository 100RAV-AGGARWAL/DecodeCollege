import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubtcreateComponent } from './doubt-create.component';

describe('DoubtcreateComponent', () => {
  let component: DoubtcreateComponent;
  let fixture: ComponentFixture<DoubtcreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoubtcreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoubtcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

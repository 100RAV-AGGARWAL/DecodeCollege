import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotePublicViewComponent } from './note-public-view.component';

describe('NotePublicViewComponent', () => {
  let component: NotePublicViewComponent;
  let fixture: ComponentFixture<NotePublicViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotePublicViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotePublicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

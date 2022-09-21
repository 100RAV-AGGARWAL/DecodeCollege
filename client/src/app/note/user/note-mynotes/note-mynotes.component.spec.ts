import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteMynotesComponent } from './note-mynotes.component';

describe('NoteMynotesComponent', () => {
  let component: NoteMynotesComponent;
  let fixture: ComponentFixture<NoteMynotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteMynotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteMynotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

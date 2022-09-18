import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotePostComponent } from './note-post.component';

describe('NotePostComponent', () => {
  let component: NotePostComponent;
  let fixture: ComponentFixture<NotePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotePostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

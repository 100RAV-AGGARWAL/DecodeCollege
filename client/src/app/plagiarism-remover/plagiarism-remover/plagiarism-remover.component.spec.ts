import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagiarismRemoverComponent } from './plagiarism-remover.component';

describe('PlagiarismRemoverComponent', () => {
  let component: PlagiarismRemoverComponent;
  let fixture: ComponentFixture<PlagiarismRemoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlagiarismRemoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagiarismRemoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

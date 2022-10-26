import { TestBed } from '@angular/core/testing';

import { PlagiarismRemoverService } from './plagiarism-remover.service';

describe('PlagiarismRemoverService', () => {
  let service: PlagiarismRemoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlagiarismRemoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

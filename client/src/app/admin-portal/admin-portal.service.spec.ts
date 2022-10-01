import { TestBed } from '@angular/core/testing';

import { AdminPortalService } from './admin-portal.service';

describe('AdminPortalService', () => {
  let service: AdminPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

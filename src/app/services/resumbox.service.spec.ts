import { TestBed } from '@angular/core/testing';

import { ResumboxService } from './resumbox.service';

describe('ResumboxService', () => {
  let service: ResumboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

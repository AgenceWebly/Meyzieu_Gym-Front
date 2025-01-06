import { TestBed } from '@angular/core/testing';

import { FormUtilityService } from './form-utility.service';

describe('FormUtilityService', () => {
  let service: FormUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

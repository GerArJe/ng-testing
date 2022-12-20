import { TestBed } from '@angular/core/testing';

import { MasterService } from './master.service';
import { FakeValueService } from './value-fake.service';
import { ValueService } from './value.service';

describe('MasterService', () => {
  let service: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);
    TestBed.configureTestingModule({
      providers: [
        MasterService,
        { provide: ValueService, useValue: spy },
      ],
    });
    service = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(
      ValueService
    ) as jasmine.SpyObj<ValueService>;
  });

  it('should be create', () => {
    expect(service).toBeTruthy();
  });

  // it('should return "my value" from the real service', () => {
  //   const valueService = new ValueService();
  //   const masterService: MasterService = new MasterService(valueService);
  //   expect(masterService.getValue()).toBe('my value');
  // });

  // it('should return "other value" from the fake service', () => {
  //   const fakeValueService = new FakeValueService();
  //   const masterService: MasterService = new MasterService(
  //     fakeValueService as unknown as ValueService
  //   );
  //   expect(masterService.getValue()).toBe('fake value');
  // });

  // it('should return "other value" from the fake object', () => {
  //   const fake = {
  //     getValue: () => 'fake from obj',
  //   };
  //   const masterService: MasterService = new MasterService(
  //     fake as ValueService
  //   );
  //   expect(masterService.getValue()).toBe('fake from obj');
  // });

  it('should call getValue from value service', () => {
    valueServiceSpy.getValue.and.returnValue('fake value');
    expect(service.getValue()).toBe('fake value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});

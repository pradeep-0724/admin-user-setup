import { TestBed } from '@angular/core/testing';

import { ConsignmentNoteCustomfieldServiceService } from './consignment-note-customfield-service.service';

describe('ConsignmentNoteCustomfieldServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsignmentNoteCustomfieldServiceService = TestBed.get(ConsignmentNoteCustomfieldServiceService);
    expect(service).toBeTruthy();
  });
});

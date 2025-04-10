import { TestBed } from '@angular/core/testing';

import { FileService } from '../files-service/files.service';

describe('FilesService', () => {
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

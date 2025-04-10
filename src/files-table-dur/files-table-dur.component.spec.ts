import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesTableDurComponent } from './files-table-dur.component';

describe('FilesTableDurComponent', () => {
  let component: FilesTableDurComponent;
  let fixture: ComponentFixture<FilesTableDurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesTableDurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesTableDurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

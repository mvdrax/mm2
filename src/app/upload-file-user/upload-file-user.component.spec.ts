import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileUserComponent } from './upload-file-user.component';

describe('UploadFileUserComponent', () => {
  let component: UploadFileUserComponent;
  let fixture: ComponentFixture<UploadFileUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFileUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFileUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

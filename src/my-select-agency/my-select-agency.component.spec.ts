import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySelectAgencyComponent } from './my-select-agency.component';

describe('MySelectAgencyComponent', () => {
  let component: MySelectAgencyComponent;
  let fixture: ComponentFixture<MySelectAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySelectAgencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySelectAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

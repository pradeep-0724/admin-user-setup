import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCertificateHistoryComponent } from './employee-certificate-history.component';

describe('EmployeeCertificateHistoryComponent', () => {
  let component: EmployeeCertificateHistoryComponent;
  let fixture: ComponentFixture<EmployeeCertificateHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeCertificateHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCertificateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

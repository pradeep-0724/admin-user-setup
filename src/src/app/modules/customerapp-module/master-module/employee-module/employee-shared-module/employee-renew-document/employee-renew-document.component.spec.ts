import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRenewDocumentComponent } from './employee-renew-document.component';

describe('EmployeeRenewDocumentComponent', () => {
  let component: EmployeeRenewDocumentComponent;
  let fixture: ComponentFixture<EmployeeRenewDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeRenewDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRenewDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

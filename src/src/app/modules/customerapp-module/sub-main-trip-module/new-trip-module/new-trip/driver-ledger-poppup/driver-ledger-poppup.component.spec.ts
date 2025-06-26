import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverLedgerPoppupComponent } from './driver-ledger-poppup.component';

describe('DriverLedgerPoppupComponent', () => {
  let component: DriverLedgerPoppupComponent;
  let fixture: ComponentFixture<DriverLedgerPoppupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverLedgerPoppupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverLedgerPoppupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

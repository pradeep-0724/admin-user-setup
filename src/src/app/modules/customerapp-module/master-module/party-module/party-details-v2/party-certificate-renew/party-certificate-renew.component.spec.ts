import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCertificateRenewComponent } from './party-certificate-renew.component';

describe('PartyCertificateRenewComponent', () => {
  let component: PartyCertificateRenewComponent;
  let fixture: ComponentFixture<PartyCertificateRenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyCertificateRenewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyCertificateRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

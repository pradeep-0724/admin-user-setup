import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCertificateComponent } from './party-certificate.component';

describe('PartyCertificateComponent', () => {
  let component: PartyCertificateComponent;
  let fixture: ComponentFixture<PartyCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

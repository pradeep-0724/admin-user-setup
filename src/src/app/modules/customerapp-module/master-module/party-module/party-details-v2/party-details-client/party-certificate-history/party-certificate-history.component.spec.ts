import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCertificateHistoryComponent } from './party-certificate-history.component';

describe('PartyCertificateHistoryComponent', () => {
  let component: PartyCertificateHistoryComponent;
  let fixture: ComponentFixture<PartyCertificateHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyCertificateHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyCertificateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

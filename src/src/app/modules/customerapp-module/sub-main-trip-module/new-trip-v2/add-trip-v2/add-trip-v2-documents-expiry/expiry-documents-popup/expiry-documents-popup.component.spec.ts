import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryDocumentsPopupComponent } from './expiry-documents-popup.component';

describe('ExpiryDocumentsPopupComponent', () => {
  let component: ExpiryDocumentsPopupComponent;
  let fixture: ComponentFixture<ExpiryDocumentsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiryDocumentsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiryDocumentsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

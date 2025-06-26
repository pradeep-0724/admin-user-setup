import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewDocumentPopupComponent } from './renew-document-popup.component';

describe('RenewDocumentPopupComponent', () => {
  let component: RenewDocumentPopupComponent;
  let fixture: ComponentFixture<RenewDocumentPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewDocumentPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewDocumentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

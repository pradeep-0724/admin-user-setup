import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSignatureAddEditComponent } from './digital-signature-add-edit.component';

describe('DigitalSignatureAddEditComponent', () => {
  let component: DigitalSignatureAddEditComponent;
  let fixture: ComponentFixture<DigitalSignatureAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalSignatureAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalSignatureAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

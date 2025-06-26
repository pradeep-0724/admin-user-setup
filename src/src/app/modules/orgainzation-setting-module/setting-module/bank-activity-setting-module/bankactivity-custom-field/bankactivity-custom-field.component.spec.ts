import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankactivityCustomFieldComponent } from './bankactivity-custom-field.component';

describe('BankactivityCustomFieldComponent', () => {
  let component: BankactivityCustomFieldComponent;
  let fixture: ComponentFixture<BankactivityCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankactivityCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankactivityCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

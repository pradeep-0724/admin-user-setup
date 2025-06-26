import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePreferencesComponent } from './invoice-preferences.component';

describe('InvoicePreferencesComponent', () => {
  let component: InvoicePreferencesComponent;
  let fixture: ComponentFixture<InvoicePreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

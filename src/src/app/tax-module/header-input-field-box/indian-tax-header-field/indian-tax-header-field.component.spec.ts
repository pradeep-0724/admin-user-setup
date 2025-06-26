import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndianTaxHeaderFieldComponent } from './indian-tax-header-field.component';

describe('IndianTaxHeaderFieldComponent', () => {
  let component: IndianTaxHeaderFieldComponent;
  let fixture: ComponentFixture<IndianTaxHeaderFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndianTaxHeaderFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndianTaxHeaderFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

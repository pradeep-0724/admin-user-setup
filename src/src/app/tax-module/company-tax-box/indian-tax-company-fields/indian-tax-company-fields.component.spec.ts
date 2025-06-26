import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndianTaxCompanyFieldsComponent } from './indian-tax-company-fields.component';

describe('IndianTaxCompanyFieldsComponent', () => {
  let component: IndianTaxCompanyFieldsComponent;
  let fixture: ComponentFixture<IndianTaxCompanyFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndianTaxCompanyFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndianTaxCompanyFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

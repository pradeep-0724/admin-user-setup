import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTaxBoxComponent } from './company-tax-box.component';

describe('CompanyTaxBoxComponent', () => {
  let component: CompanyTaxBoxComponent;
  let fixture: ComponentFixture<CompanyTaxBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTaxBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTaxBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

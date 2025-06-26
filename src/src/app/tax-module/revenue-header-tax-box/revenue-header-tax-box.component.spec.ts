import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueHeaderTaxBoxComponent } from './revenue-header-tax-box.component';

describe('RevenueHeaderTaxBoxComponent', () => {
  let component: RevenueHeaderTaxBoxComponent;
  let fixture: ComponentFixture<RevenueHeaderTaxBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueHeaderTaxBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueHeaderTaxBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

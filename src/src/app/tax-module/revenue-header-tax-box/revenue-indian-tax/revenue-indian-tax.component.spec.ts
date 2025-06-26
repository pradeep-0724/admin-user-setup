import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueIndianTaxComponent } from './revenue-indian-tax.component';

describe('RevenueIndianTaxComponent', () => {
  let component: RevenueIndianTaxComponent;
  let fixture: ComponentFixture<RevenueIndianTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueIndianTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueIndianTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

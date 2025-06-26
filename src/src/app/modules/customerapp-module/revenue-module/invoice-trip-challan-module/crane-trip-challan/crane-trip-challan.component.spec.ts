import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraneTripChallanComponent } from './crane-trip-challan.component';

describe('CraneTripChallanComponent', () => {
  let component: CraneTripChallanComponent;
  let fixture: ComponentFixture<CraneTripChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CraneTripChallanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraneTripChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

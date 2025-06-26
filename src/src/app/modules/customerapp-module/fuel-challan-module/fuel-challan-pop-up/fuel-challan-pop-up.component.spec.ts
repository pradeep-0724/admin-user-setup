import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelChallanPopUpComponent } from './fuel-challan-pop-up.component';

describe('FuelChallanPopUpComponent', () => {
  let component: FuelChallanPopUpComponent;
  let fixture: ComponentFixture<FuelChallanPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelChallanPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelChallanPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

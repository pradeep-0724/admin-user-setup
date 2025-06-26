import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripChallanComponent } from './trip-challan.component';

describe('TripChallanComponent', () => {
  let component: TripChallanComponent;
  let fixture: ComponentFixture<TripChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

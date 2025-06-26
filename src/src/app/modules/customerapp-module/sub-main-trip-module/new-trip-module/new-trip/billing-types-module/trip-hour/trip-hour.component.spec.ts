import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripHourComponent } from './trip-hour.component';

describe('TripHourComponent', () => {
  let component: TripHourComponent;
  let fixture: ComponentFixture<TripHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

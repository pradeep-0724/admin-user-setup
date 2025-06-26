import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripUnitsComponent } from './trip-units.component';

describe('TripUnitsComponent', () => {
  let component: TripUnitsComponent;
  let fixture: ComponentFixture<TripUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripUnitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

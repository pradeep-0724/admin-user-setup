import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripGallonsComponent } from './trip-gallons.component';

describe('TripGallonsComponent', () => {
  let component: TripGallonsComponent;
  let fixture: ComponentFixture<TripGallonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripGallonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripGallonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldTripDataComponent } from './old-trip-data.component';

describe('OldTripDataComponent', () => {
  let component: OldTripDataComponent;
  let fixture: ComponentFixture<OldTripDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldTripDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldTripDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

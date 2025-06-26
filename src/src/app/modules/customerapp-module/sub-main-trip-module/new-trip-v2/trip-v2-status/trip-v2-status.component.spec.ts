import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripV2StatusComponent } from './trip-v2-status.component';

describe('TripV2StatusComponent', () => {
  let component: TripV2StatusComponent;
  let fixture: ComponentFixture<TripV2StatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripV2StatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripV2StatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

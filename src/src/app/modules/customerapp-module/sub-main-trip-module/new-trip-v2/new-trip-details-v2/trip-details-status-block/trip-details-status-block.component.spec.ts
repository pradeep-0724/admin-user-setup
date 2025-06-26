import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsStatusBlockComponent } from './trip-details-status-block.component';

describe('TripDetailsStatusBlockComponent', () => {
  let component: TripDetailsStatusBlockComponent;
  let fixture: ComponentFixture<TripDetailsStatusBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsStatusBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsStatusBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

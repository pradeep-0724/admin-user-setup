import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsVoidJobComponent } from './trip-details-void-job.component';

describe('TripDetailsVoidJobComponent', () => {
  let component: TripDetailsVoidJobComponent;
  let fixture: ComponentFixture<TripDetailsVoidJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsVoidJobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsVoidJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

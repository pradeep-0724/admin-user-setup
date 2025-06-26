import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripFixedComponent } from './trip-fixed.component';

describe('TripFixedComponent', () => {
  let component: TripFixedComponent;
  let fixture: ComponentFixture<TripFixedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripFixedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

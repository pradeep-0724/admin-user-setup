import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripLitersComponent } from './trip-liters.component';

describe('TripLitersComponent', () => {
  let component: TripLitersComponent;
  let fixture: ComponentFixture<TripLitersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripLitersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripLitersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

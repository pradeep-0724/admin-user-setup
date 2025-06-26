import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripReduceToBillComponent } from './trip-reduce-to-bill.component';

describe('TripReduceToBillComponent', () => {
  let component: TripReduceToBillComponent;
  let fixture: ComponentFixture<TripReduceToBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripReduceToBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripReduceToBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMultiTripComponent } from './create-multi-trip.component';

describe('CreateMultiTripComponent', () => {
  let component: CreateMultiTripComponent;
  let fixture: ComponentFixture<CreateMultiTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMultiTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMultiTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

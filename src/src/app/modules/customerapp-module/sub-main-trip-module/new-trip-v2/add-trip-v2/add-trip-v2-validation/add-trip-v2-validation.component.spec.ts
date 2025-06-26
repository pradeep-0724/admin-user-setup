import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTripV2ValidationComponent } from './add-trip-v2-validation.component';

describe('AddTripV2ValidationComponent', () => {
  let component: AddTripV2ValidationComponent;
  let fixture: ComponentFixture<AddTripV2ValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTripV2ValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTripV2ValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

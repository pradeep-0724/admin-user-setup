import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTripHeaderComponent } from './edit-trip-header.component';

describe('EditTripHeaderComponent', () => {
  let component: EditTripHeaderComponent;
  let fixture: ComponentFixture<EditTripHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTripHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTripHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

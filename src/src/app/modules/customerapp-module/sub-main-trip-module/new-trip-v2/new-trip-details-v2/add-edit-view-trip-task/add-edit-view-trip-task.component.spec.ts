import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditViewTripTaskComponent } from './add-edit-view-trip-task.component';

describe('AddEditViewTripTaskComponent', () => {
  let component: AddEditViewTripTaskComponent;
  let fixture: ComponentFixture<AddEditViewTripTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditViewTripTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditViewTripTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

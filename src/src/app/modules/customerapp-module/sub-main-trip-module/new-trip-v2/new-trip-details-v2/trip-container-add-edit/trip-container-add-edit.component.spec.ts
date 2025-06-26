import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripContainerAddEditComponent } from './trip-container-add-edit.component';

describe('TripContainerAddEditComponent', () => {
  let component: TripContainerAddEditComponent;
  let fixture: ComponentFixture<TripContainerAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripContainerAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripContainerAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTripInfoComponent } from './employee-trip-info.component';

describe('EmployeeTripInfoComponent', () => {
  let component: EmployeeTripInfoComponent;
  let fixture: ComponentFixture<EmployeeTripInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTripInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTripInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

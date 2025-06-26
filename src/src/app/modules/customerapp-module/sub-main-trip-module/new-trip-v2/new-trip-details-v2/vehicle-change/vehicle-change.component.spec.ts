import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleChangeComponent } from './vehicle-change.component';

describe('VehicleChangeComponent', () => {
  let component: VehicleChangeComponent;
  let fixture: ComponentFixture<VehicleChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

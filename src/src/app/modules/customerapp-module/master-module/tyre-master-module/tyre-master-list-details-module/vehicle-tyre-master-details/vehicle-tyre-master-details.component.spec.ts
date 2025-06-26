import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTyreMasterDetailsComponent } from './vehicle-tyre-master-details.component';

describe('VehicleTyreMasterDetailsComponent', () => {
  let component: VehicleTyreMasterDetailsComponent;
  let fixture: ComponentFixture<VehicleTyreMasterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTyreMasterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTyreMasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

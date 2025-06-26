import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTyreMasterListComponent } from './vehicle-tyre-master-list.component';

describe('VehicleTyreMasterListComponent', () => {
  let component: VehicleTyreMasterListComponent;
  let fixture: ComponentFixture<VehicleTyreMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTyreMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTyreMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

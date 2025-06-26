import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderCargoMaterialTabComponent } from './work-order-cargo-material-tab.component';

describe('WorkOrderCargoMaterialTabComponent', () => {
  let component: WorkOrderCargoMaterialTabComponent;
  let fixture: ComponentFixture<WorkOrderCargoMaterialTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderCargoMaterialTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderCargoMaterialTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

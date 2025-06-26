import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderCargoJobInfoComponent } from './work-order-cargo-job-info.component';

describe('WorkOrderCargoJobInfoComponent', () => {
  let component: WorkOrderCargoJobInfoComponent;
  let fixture: ComponentFixture<WorkOrderCargoJobInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderCargoJobInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderCargoJobInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

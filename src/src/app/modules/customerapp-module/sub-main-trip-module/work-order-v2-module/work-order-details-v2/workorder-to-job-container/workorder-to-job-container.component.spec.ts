import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderToJobContainerComponent } from './workorder-to-job-container.component';

describe('WorkorderToJobContainerComponent', () => {
  let component: WorkorderToJobContainerComponent;
  let fixture: ComponentFixture<WorkorderToJobContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkorderToJobContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkorderToJobContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

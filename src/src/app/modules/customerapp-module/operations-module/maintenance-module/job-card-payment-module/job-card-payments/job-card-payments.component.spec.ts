import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardPaymentsComponent } from './job-card-payments.component';

describe('JobCardPaymentsComponent', () => {
  let component: JobCardPaymentsComponent;
  let fixture: ComponentFixture<JobCardPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCardPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCardPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

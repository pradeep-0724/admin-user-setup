import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobGatePassPdfComponent } from './job-gate-pass-pdf.component';

describe('JobGatePassPdfComponent', () => {
  let component: JobGatePassPdfComponent;
  let fixture: ComponentFixture<JobGatePassPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobGatePassPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobGatePassPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

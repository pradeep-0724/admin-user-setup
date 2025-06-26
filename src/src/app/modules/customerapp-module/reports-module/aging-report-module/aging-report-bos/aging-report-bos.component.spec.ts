import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingReportBosComponent } from './aging-report-bos.component';

describe('AgingReportBosComponent', () => {
  let component: AgingReportBosComponent;
  let fixture: ComponentFixture<AgingReportBosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingReportBosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingReportBosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreMasterReportViewComponent } from './tyre-master-report-view.component';

describe('TyreMasterReportViewComponent', () => {
  let component: TyreMasterReportViewComponent;
  let fixture: ComponentFixture<TyreMasterReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TyreMasterReportViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TyreMasterReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

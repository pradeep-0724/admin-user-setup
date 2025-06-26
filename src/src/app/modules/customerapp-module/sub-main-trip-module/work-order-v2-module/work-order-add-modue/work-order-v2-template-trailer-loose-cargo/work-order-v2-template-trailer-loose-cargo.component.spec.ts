import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderV2TemplateTrailerLooseCargoComponent } from './work-order-v2-template-trailer-loose-cargo.component';

describe('WorkOrderV2TemplateTrailerLooseCargoComponent', () => {
  let component: WorkOrderV2TemplateTrailerLooseCargoComponent;
  let fixture: ComponentFixture<WorkOrderV2TemplateTrailerLooseCargoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderV2TemplateTrailerLooseCargoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderV2TemplateTrailerLooseCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

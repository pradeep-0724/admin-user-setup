import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSiteInspectionComponent } from './view-site-inspection.component';

describe('ViewSiteInspectionComponent', () => {
  let component: ViewSiteInspectionComponent;
  let fixture: ComponentFixture<ViewSiteInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSiteInspectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSiteInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSiteInspectionComponent } from './list-site-inspection.component';

describe('ListSiteInspectionComponent', () => {
  let component: ListSiteInspectionComponent;
  let fixture: ComponentFixture<ListSiteInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSiteInspectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSiteInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

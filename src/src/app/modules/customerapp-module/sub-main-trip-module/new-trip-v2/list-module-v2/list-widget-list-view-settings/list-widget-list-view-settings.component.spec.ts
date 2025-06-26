import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWidgetListViewSettingsComponent } from './list-widget-list-view-settings.component';

describe('ListWidgetListViewSettingsComponent', () => {
  let component: ListWidgetListViewSettingsComponent;
  let fixture: ComponentFixture<ListWidgetListViewSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWidgetListViewSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListWidgetListViewSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

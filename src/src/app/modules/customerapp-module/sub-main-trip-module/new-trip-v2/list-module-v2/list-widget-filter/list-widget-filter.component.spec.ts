import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWidgetFilterComponent } from './list-widget-filter.component';

describe('ListWidgetFilterComponent', () => {
  let component: ListWidgetFilterComponent;
  let fixture: ComponentFixture<ListWidgetFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWidgetFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListWidgetFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

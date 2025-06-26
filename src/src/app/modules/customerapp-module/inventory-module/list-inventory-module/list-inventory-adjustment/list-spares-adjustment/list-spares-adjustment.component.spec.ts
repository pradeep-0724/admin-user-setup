import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSparesAdjustmentComponent } from './list-spares-adjustment.component';

describe('ListSparesAdjustmentComponent', () => {
  let component: ListSparesAdjustmentComponent;
  let fixture: ComponentFixture<ListSparesAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSparesAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSparesAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

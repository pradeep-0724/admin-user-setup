import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpareSummaryComponent } from './spare-summary.component';

describe('SpareSummaryComponent', () => {
  let component: SpareSummaryComponent;
  let fixture: ComponentFixture<SpareSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpareSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpareSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpoPdfViewComponent } from './lpo-pdf-view.component';

describe('LpoPdfViewComponent', () => {
  let component: LpoPdfViewComponent;
  let fixture: ComponentFixture<LpoPdfViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpoPdfViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LpoPdfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

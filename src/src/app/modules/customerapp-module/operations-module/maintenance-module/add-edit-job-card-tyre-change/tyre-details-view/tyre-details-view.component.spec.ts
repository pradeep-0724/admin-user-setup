import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreDetailsViewComponent } from './tyre-details-view.component';

describe('TyreDetailsViewComponent', () => {
  let component: TyreDetailsViewComponent;
  let fixture: ComponentFixture<TyreDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TyreDetailsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TyreDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

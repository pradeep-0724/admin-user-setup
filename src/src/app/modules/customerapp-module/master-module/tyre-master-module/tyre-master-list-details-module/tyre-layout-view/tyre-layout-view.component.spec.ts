import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreLayoutViewComponent } from './tyre-layout-view.component';

describe('TyreLayoutViewComponent', () => {
  let component: TyreLayoutViewComponent;
  let fixture: ComponentFixture<TyreLayoutViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TyreLayoutViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TyreLayoutViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

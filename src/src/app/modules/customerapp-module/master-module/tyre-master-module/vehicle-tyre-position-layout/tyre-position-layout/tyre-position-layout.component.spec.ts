import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyrePositionLayoutComponent } from './tyre-position-layout.component';

describe('TyrePositionLayoutComponent', () => {
  let component: TyrePositionLayoutComponent;
  let fixture: ComponentFixture<TyrePositionLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TyrePositionLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TyrePositionLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

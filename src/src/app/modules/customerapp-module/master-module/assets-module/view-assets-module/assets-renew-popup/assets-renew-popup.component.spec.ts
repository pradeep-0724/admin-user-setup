import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsRenewPopupComponent } from './assets-renew-popup.component';

describe('AssetsRenewPopupComponent', () => {
  let component: AssetsRenewPopupComponent;
  let fixture: ComponentFixture<AssetsRenewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsRenewPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsRenewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

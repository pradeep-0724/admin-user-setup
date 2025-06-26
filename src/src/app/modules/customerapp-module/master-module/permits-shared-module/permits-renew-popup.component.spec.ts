import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermitsRenewPopupComponent } from './permits-renew-popup.component';


describe('AssetsRenewPopupComponent', () => {
  let component: PermitsRenewPopupComponent;
  let fixture: ComponentFixture<PermitsRenewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitsRenewPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitsRenewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

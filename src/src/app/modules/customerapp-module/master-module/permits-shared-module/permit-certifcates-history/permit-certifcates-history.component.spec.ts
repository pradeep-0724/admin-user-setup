import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermitCertifcatesHistoryComponent } from './permit-certifcates-history.component';


describe('PermitCertifcatesHistoryComponent', () => {
  let component: PermitCertifcatesHistoryComponent;
  let fixture: ComponentFixture<PermitCertifcatesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitCertifcatesHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitCertifcatesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsCertificateComponent } from './assets-certificate.component';

describe('AssetsCertificateComponent', () => {
  let component: AssetsCertificateComponent;
  let fixture: ComponentFixture<AssetsCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

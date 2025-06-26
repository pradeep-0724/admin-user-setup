import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSignatureListComponent } from './digital-signature-list.component';

describe('DigitalSignatureListComponent', () => {
  let component: DigitalSignatureListComponent;
  let fixture: ComponentFixture<DigitalSignatureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalSignatureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalSignatureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTokenPupupComponent } from './cancel-token-pupup.component';

describe('CancelTokenPupupComponent', () => {
  let component: CancelTokenPupupComponent;
  let fixture: ComponentFixture<CancelTokenPupupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelTokenPupupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelTokenPupupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

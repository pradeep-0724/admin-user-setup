import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancesPopupComponent } from './advances-popup.component';

describe('AdvancesPopupComponent', () => {
  let component: AdvancesPopupComponent;
  let fixture: ComponentFixture<AdvancesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

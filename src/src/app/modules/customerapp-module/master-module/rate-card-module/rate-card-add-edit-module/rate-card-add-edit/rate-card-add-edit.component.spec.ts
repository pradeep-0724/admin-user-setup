import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardAddEditComponent } from './rate-card-add-edit.component';

describe('RateCardAddEditComponent', () => {
  let component: RateCardAddEditComponent;
  let fixture: ComponentFixture<RateCardAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateCardAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateCardAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

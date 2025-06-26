import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxInclusiveComponent } from './tax-inclusive.component';

describe('TaxInclusiveComponent', () => {
  let component: TaxInclusiveComponent;
  let fixture: ComponentFixture<TaxInclusiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxInclusiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxInclusiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

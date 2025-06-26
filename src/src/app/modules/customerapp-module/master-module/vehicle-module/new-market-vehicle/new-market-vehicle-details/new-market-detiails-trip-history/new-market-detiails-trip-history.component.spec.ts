import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMarketDetiailsTripHistoryComponent } from './new-market-detiails-trip-history.component';

describe('NewMarketDetiailsTripHistoryComponent', () => {
  let component: NewMarketDetiailsTripHistoryComponent;
  let fixture: ComponentFixture<NewMarketDetiailsTripHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMarketDetiailsTripHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMarketDetiailsTripHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

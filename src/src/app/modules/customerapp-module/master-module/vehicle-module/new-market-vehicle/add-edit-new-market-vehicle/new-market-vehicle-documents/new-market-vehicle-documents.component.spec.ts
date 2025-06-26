import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMarketVehicleDocumentsComponent } from './new-market-vehicle-documents.component';

describe('NewMarketVehicleDocumentsComponent', () => {
  let component: NewMarketVehicleDocumentsComponent;
  let fixture: ComponentFixture<NewMarketVehicleDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMarketVehicleDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMarketVehicleDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

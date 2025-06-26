import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTyreDetailsSectionComponent } from './assets-tyre-details-section.component';

describe('AssetsTyreDetailsSectionComponent', () => {
  let component: AssetsTyreDetailsSectionComponent;
  let fixture: ComponentFixture<AssetsTyreDetailsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsTyreDetailsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTyreDetailsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

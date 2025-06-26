import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsDetailsSectionComponent } from './assets-details-section.component';

describe('AssetsDetailsSectionComponent', () => {
  let component: AssetsDetailsSectionComponent;
  let fixture: ComponentFixture<AssetsDetailsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsDetailsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsDetailsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

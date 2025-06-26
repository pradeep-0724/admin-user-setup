import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsInfoSectionComponent } from './assets-info-section.component';

describe('AssetsInfoSectionComponent', () => {
  let component: AssetsInfoSectionComponent;
  let fixture: ComponentFixture<AssetsInfoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsInfoSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsInfoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

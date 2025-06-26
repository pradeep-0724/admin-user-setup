import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsHeaderSectionComponent } from './assets-header-section.component';

describe('AssetsHeaderSectionComponent', () => {
  let component: AssetsHeaderSectionComponent;
  let fixture: ComponentFixture<AssetsHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsHeaderSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsPermitsComponent } from './assets-permits.component';

describe('AssetsPermitsComponent', () => {
  let component: AssetsPermitsComponent;
  let fixture: ComponentFixture<AssetsPermitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsPermitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsPermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

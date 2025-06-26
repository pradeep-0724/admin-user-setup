import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefrenceComponent } from './prefrence.component';

describe('PrefrenceComponent', () => {
  let component: PrefrenceComponent;
  let fixture: ComponentFixture<PrefrenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrefrenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrefrenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

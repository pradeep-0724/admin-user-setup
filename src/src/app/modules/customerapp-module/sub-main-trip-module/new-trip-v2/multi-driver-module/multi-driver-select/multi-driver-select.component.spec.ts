import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDriverSelectComponent } from './multi-driver-select.component';

describe('MultiDriverSelectComponent', () => {
  let component: MultiDriverSelectComponent;
  let fixture: ComponentFixture<MultiDriverSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDriverSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiDriverSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

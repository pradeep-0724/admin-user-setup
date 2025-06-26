import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoThroughComponent } from './go-through.component';

describe('GoThroughComponent', () => {
  let component: GoThroughComponent;
  let fixture: ComponentFixture<GoThroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoThroughComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoThroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

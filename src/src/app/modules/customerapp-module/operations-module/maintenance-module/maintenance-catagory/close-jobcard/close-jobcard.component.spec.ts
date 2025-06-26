import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseJobcardComponent } from './close-jobcard.component';

describe('CloseJobcardComponent', () => {
  let component: CloseJobcardComponent;
  let fixture: ComponentFixture<CloseJobcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseJobcardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseJobcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAttachmentsComponent } from './assets-attachments.component';

describe('AssetsAttachmentsComponent', () => {
  let component: AssetsAttachmentsComponent;
  let fixture: ComponentFixture<AssetsAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsAttachmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

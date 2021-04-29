import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndReviewComponent } from './end-review.component';

describe('EndReviewComponent', () => {
  let component: EndReviewComponent;
  let fixture: ComponentFixture<EndReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

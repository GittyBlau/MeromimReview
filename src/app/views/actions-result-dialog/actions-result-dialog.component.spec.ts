import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsResultDialogComponent } from './actions-result-dialog.component';

describe('ActionsResultDialogComponent', () => {
  let component: ActionsResultDialogComponent;
  let fixture: ComponentFixture<ActionsResultDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsResultDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

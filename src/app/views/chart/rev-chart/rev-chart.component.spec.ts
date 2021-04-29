import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevChartComponent } from './rev-chart.component';

describe('RevChartComponent', () => {
  let component: RevChartComponent;
  let fixture: ComponentFixture<RevChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendGraphsComponent } from './trend-graphs.component';

describe('TrendGraphsComponent', () => {
  let component: TrendGraphsComponent;
  let fixture: ComponentFixture<TrendGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendGraphsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

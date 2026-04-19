import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthRowComponent } from './month-row.component';

describe('MonthRowComponent', () => {
  let component: MonthRowComponent;
  let fixture: ComponentFixture<MonthRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Fund } from '../../services/funds.service';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnChanges {

  /* Incoming datasets */
  @Input() bids: any[] = [];
  @Input() funds: Fund[] = [];

  /* Filter values */
  fund: string = '';
  department: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  minAmount: number | null = null;
  maxAmount: number | null = null;

  /* Dropdown options */
  fundOptions: string[] = [];
  departments: string[] = [];

  @Output() filtersChanged = new EventEmitter<any>();

  /* Populate dropdowns when inputs change */
  ngOnChanges(): void {

    /* Fund options from backend list */
    if (this.funds && this.funds.length > 0) {
      this.fundOptions = this.funds.map(f => f.name).sort();
      this.fundOptions.unshift('');
    }

    /* Department options from bid dataset */
    if (this.bids && this.bids.length > 0) {
      this.departments = Array.from(new Set(this.bids.map(b => b.Department))).sort();
      this.departments.unshift('');
    }
  }

  /* Date validation */
  validateDateRange() {
    if (this.startDate && this.endDate && this.endDate < this.startDate) {
      this.endDate = this.startDate;
    }
  }

  /* Amount validation */
  validateAmountRange() {
    if (this.minAmount && this.maxAmount && this.maxAmount < this.minAmount) {
      this.maxAmount = this.minAmount;
    }
  }

  /* Apply filters */
  applyFilters() {
    this.filtersChanged.emit({
      fund: this.fund,
      department: this.department,
      startDate: this.startDate,
      endDate: this.endDate,
      minAmount: this.minAmount,
      maxAmount: this.maxAmount
    });
  }

  /* Clear filters */
  clearFilters() {
    this.fund = '';
    this.department = '';
    this.startDate = null;
    this.endDate = null;
    this.minAmount = null;
    this.maxAmount = null;
    this.applyFilters();
  }
}

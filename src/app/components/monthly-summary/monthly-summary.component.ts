import { Component, Input, OnChanges } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Bid {
  closedate: string;
  winningbid: number | string;
  fund: string;
  department: string;
}

interface MonthlySummary {
  monthEnd: Date;
  bidCount: number;
  totalVolume: number;
  avgBid: number;
}

@Component({
  selector: 'app-monthly-summary',
  standalone: true,
  templateUrl: './monthly-summary.component.html',
  styleUrls: ['./monthly-summary.component.css'],
  imports: [NgFor, CurrencyPipe, DatePipe, FormsModule]
})
export class MonthlySummaryComponent implements OnChanges {
  @Input() bids: Bid[] = [];

  filteredBids: Bid[] = [];

  // Local filter fields
  selectedFund: string | null = null;
  selectedDepartment: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;

  monthlySummaries: MonthlySummary[] = [];

  ngOnChanges(): void {
    if (this.bids?.length) {
      this.applyFilters();
    }
  }

  // Apply filters using your REAL camelCase field names
  applyFilters(): void {
    let result = [...this.bids];

    if (this.selectedFund) {
      result = result.filter(b => b.fund === this.selectedFund);
    }

    if (this.selectedDepartment) {
      result = result.filter(b => b.department === this.selectedDepartment);
    }

    if (this.startDate) {
      result = result.filter(b => b.closedate >= this.startDate!);
    }

    if (this.endDate) {
      result = result.filter(b => b.closedate <= this.endDate!);
    }

    this.filteredBids = result;
    this.buildMonthlySummaries();
  }

  // Build month-end rollups from filtered bids
  private buildMonthlySummaries(): void {
    const map = new Map<string, Bid[]>();

    for (const bid of this.filteredBids) {
      const d = new Date(bid.closedate);
      const key = `${d.getFullYear()}-${d.getMonth()}`;

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(bid);
    }

    const summaries: MonthlySummary[] = [];

    map.forEach((bids, key) => {
      const [yearStr, monthStr] = key.split('-');
      const year = Number(yearStr);
      const month = Number(monthStr);

      const monthEnd = new Date(year, month + 1, 0);

      const bidCount = bids.length;
      const totalVolume = bids.reduce(
        (sum, b) => sum + Number(b.winningbid || 0),
        0
      );
      const avgBid = bidCount ? totalVolume / bidCount : 0;

      summaries.push({ monthEnd, bidCount, totalVolume, avgBid });
    });

    // Sort newest → oldest
    this.monthlySummaries = summaries.sort(
      (a, b) => b.monthEnd.getTime() - a.monthEnd.getTime()
    );
  }
}

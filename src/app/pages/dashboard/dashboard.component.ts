import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { MonthlySummaryComponent } from '../../components/monthly-summary/monthly-summary.component';
import { TrendGraphsComponent } from '../../components/trend-graphs/trend-graphs.component';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { BidsService } from '../../services/bids.service';
import { Router } from '@angular/router';
import { FundsService, Fund } from '../../services/funds.service';

interface Bid {
  CloseDate: string;
  WinningBid: number | string;
  Fund: string;
  Department: string;
}

interface MonthlySummary {
  monthEnd: Date;
  bidCount: number;
  totalVolume: number;
  avgBid: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    HeaderComponent,
    FilterBarComponent,
    MonthlySummaryComponent,
    TrendGraphsComponent,
    CurrencyPipe,
    DatePipe,
    NgFor,
    NgIf
  ]
})
export class DashboardComponent implements OnInit {

  // Hold all bid records
  bids: Bid[] = [];

  // Hold filtered bid results
  filteredBids: Bid[] = [];

  // Hold available fund options
  funds: Fund[] = [];

  // Active filter selections
  selectedFund: string | null = null;
  selectedDepartment: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  minAmount: number | null = null;
  maxAmount: number | null = null;

  // KPI values for the dashboard
  kpis: any = {};

  // Monthly summary data for charts
  monthlySummaries: MonthlySummary[] = [];

  constructor(
    private bidsService: BidsService,
    private router: Router,
    private fundsService: FundsService
  ) { }

  ngOnInit(): void {

    // Loads fund list for filter options
    // Loads unrestricted fund list for general users
    this.fundsService.getFunds('general').subscribe(data => {
      this.funds = data;
    });

    // Loads all bid data for the dashboard
    this.bidsService.getBids().subscribe((data: Bid[]) => {
      this.bids = data;
      this.filteredBids = [...data];
      this.computeKpis();
      this.buildMonthlySummaries();
    });
  }

  onFiltersChanged(filters: any): void {

    // Stores active filter values
    this.selectedFund = filters.fund;
    this.selectedDepartment = filters.department;
    this.startDate = filters.startDate;
    this.endDate = filters.endDate;
    this.minAmount = filters.minAmount;
    this.maxAmount = filters.maxAmount;

    this.applyFilters();
  }

  applyFilters(): void {

    // Start with unfiltered data
    let result = [...this.bids];

    // Filter by fund name
    if (this.selectedFund && this.selectedFund.trim() !== "") {
      result = result.filter(b => b.Fund?.trim() === this.selectedFund!.trim());
    }

    // Filter by department name
    if (this.selectedDepartment && this.selectedDepartment.trim() !== "") {
      result = result.filter(b => b.Department === this.selectedDepartment);
    }

    // Filter by start date
    if (this.startDate) {
      result = result.filter(b => b.CloseDate >= this.startDate!);
    }

    // Filter by end date
    if (this.endDate) {
      result = result.filter(b => b.CloseDate <= this.endDate!);
    }

    // Filter by minimum bid amount
    if (this.minAmount !== null) {
      result = result.filter(b => Number(b.WinningBid) >= this.minAmount!);
    }

    // Filter by maximum bid amount
    if (this.maxAmount !== null) {
      result = result.filter(b => Number(b.WinningBid) <= this.maxAmount!);
    }

    // Update filtered results
    this.filteredBids = result;

    this.computeKpis();
    this.buildMonthlySummaries();
  }

  goToBidDetail(): void {
    // Navigate to the bid detail screen
    this.router.navigate(['/bid-detail']);
  }

  private computeKpis(): void {

    // Calculate KPI values from filtered results
    const totalBids = this.filteredBids.length;

    const totalVolume = this.filteredBids.reduce(
      (sum, b) => sum + Number(b.WinningBid || 0),
      0
    );

    const avgBid = totalBids > 0 ? totalVolume / totalBids : 0;

    this.kpis = {
      BidCount: totalBids,
      TotalBidVolume: totalVolume,
      AvgBidAmount: avgBid
    };
  }

  private buildMonthlySummaries(): void {

    // Group bids by month for summary charts
    const map = new Map<string, { bids: Bid[] }>();

    for (const bid of this.filteredBids) {
      const d = new Date(bid.CloseDate);
      const key = `${d.getFullYear()}-${d.getMonth()}`;

      if (!map.has(key)) {
        map.set(key, { bids: [] });
      }
      map.get(key)!.bids.push(bid);
    }

    const summaries: MonthlySummary[] = [];

    // Builds summary metrics for each month
    map.forEach((value, key) => {
      const [yearStr, monthStr] = key.split('-');
      const year = Number(yearStr);
      const month = Number(monthStr);

      const monthEnd = new Date(year, month + 1, 0);

      const bidCount = value.bids.length;
      const totalVolume = value.bids.reduce(
        (sum, b) => sum + Number(b.WinningBid || 0),
        0
      );
      const avgBid = bidCount > 0 ? totalVolume / bidCount : 0;

      summaries.push({
        monthEnd,
        bidCount,
        totalVolume,
        avgBid
      });
    });

    // Sorts summaries by most recent month
    this.monthlySummaries = summaries.sort(
      (a, b) => b.monthEnd.getTime() - a.monthEnd.getTime()
    );
  }
}

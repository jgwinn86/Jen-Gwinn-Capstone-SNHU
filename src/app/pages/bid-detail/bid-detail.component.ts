import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BidsService } from '../../services/bids.service';
import { FundsService, Fund } from '../../services/funds.service';

import { HeaderComponent } from '../../components/header/header.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';

interface Bid {
  ArticleID: number | string;
  CloseDate: string;
  WinningBid: number | string;
  Department: string;
  Fund: string;
  ArticleTitle: string;
}

@Component({
  selector: 'app-bid-detail',
  standalone: true,
  templateUrl: './bid-detail.component.html',
  styleUrls: ['./bid-detail.component.css'],
  imports: [
    CurrencyPipe,
    DatePipe,
    JsonPipe,
    NgFor,
    NgIf,
    FormsModule,
    HeaderComponent,
    FilterBarComponent
  ]
})
export class BidDetailComponent implements OnInit {

  bids: Bid[] = [];
  filteredBids: Bid[] = [];

  funds: Fund[] = [];

  totalBidAmount: number = 0;
  bidCount: number = 0;
  avgBidAmount: number = 0;

  searchText: string = '';
  activeFilters: any = {};

  constructor(
    private bidsService: BidsService,
    private fundsService: FundsService
  ) { }

  ngOnInit(): void {

    // Load funds for the filter bar
    //change "general" to "admin" to see "enterprise" fund bids
    this.fundsService.getFunds('general').subscribe(data => {
      this.funds = data;
    });

    // Load bids
    this.bidsService.getBids().subscribe(data => {

      // Remove Enterprise bids for general users
      this.bids = data.filter(b => b.Fund.trim() !== 'Enterprise');

      this.filteredBids = [...this.bids];
      this.updateKpis();
    });
  }

  onFiltersChanged(filters: any): void {
    this.activeFilters = filters;
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchText.toLowerCase();
    const f = this.activeFilters;

    this.filteredBids = this.bids.filter(b => {

      const matchesSearch = JSON.stringify(b).toLowerCase().includes(search);

      const matchesFund =
        !f?.fund || f.fund.trim() === "" || b.Fund.trim() === f.fund.trim();

      const matchesDept =
        !f?.department || b.Department === f.department;

      const closeDate = new Date(b.CloseDate);
      const matchesStart =
        !f?.startDate || closeDate >= new Date(f.startDate);
      const matchesEnd =
        !f?.endDate || closeDate <= new Date(f.endDate);

      const bid = Number(b.WinningBid || 0);
      const matchesMin =
        !f?.minAmount || bid >= f.minAmount;
      const matchesMax =
        !f?.maxAmount || bid <= f.maxAmount;

      return (
        matchesSearch &&
        matchesFund &&
        matchesDept &&
        matchesStart &&
        matchesEnd &&
        matchesMin &&
        matchesMax
      );
    });

    this.updateKpis();
  }

  private updateKpis(): void {
    this.bidCount = this.filteredBids.length;

    this.totalBidAmount = this.filteredBids.reduce(
      (sum, b) => sum + Number(b.WinningBid || 0),
      0
    );

    this.avgBidAmount =
      this.bidCount > 0 ? this.totalBidAmount / this.bidCount : 0;
  }

  goBack(): void {
    window.location.href = 'http://localhost:4200/dashboard';
  }
}

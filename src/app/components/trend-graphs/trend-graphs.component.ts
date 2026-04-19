import { Component, Input, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-trend-graphs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trend-graphs.component.html',
  styleUrls: ['./trend-graphs.component.css']
})
export class TrendGraphsComponent implements OnChanges {

  /* Filtered dataset from dashboard */
  @Input() bids: any[] = [];

  /* Canvas references */
  @ViewChild('volumeChart') volumeChartRef!: ElementRef;
  @ViewChild('avgChart') avgChartRef!: ElementRef;
  @ViewChild('countChart') countChartRef!: ElementRef;

  /* Chart instances */
  volumeChart: any;
  avgChart: any;
  countChart: any;

  /* Rebuild charts when input data changes */
  ngOnChanges(): void {
    if (this.bids && this.bids.length > 0) {
      this.buildCharts();
    } else {
      this.destroyCharts();
    }
  }

  /* Create or refresh charts */
  private buildCharts(): void {
    const grouped = this.groupByYearMonth(this.bids);

    const labels = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];

    const datasetsVolume = this.buildDatasets(grouped, 'totalVolume');
    const datasetsAvg = this.buildDatasets(grouped, 'avgBid');
    const datasetsCount = this.buildDatasets(grouped, 'count');

    this.destroyCharts();

    this.volumeChart = new Chart(this.volumeChartRef.nativeElement, {
  type: 'line',
  data: { labels, datasets: datasetsVolume },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Total Volume ($) - YOY'
      }
    }
  }
});

this.avgChart = new Chart(this.avgChartRef.nativeElement, {
  type: 'line',
  data: { labels, datasets: datasetsAvg },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Average Bid ($) - YOY'
      }
    }
  }
});

this.countChart = new Chart(this.countChartRef.nativeElement, {
  type: 'line',
  data: { labels, datasets: datasetsCount },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Total Bids - YOY'
      }
    }
  }
});
  }

  /* Remove existing charts before rebuilding */
  private destroyCharts(): void {
    if (this.volumeChart) { this.volumeChart.destroy(); this.volumeChart = null; }
    if (this.avgChart) { this.avgChart.destroy(); this.avgChart = null; }
    if (this.countChart) { this.countChart.destroy(); this.countChart = null; }
  }

  /* Group bids by year and month */
  private groupByYearMonth(bids: any[]) {
    const years = [2014, 2015, 2016];
    const result: any = {};

    for (const y of years) {
      result[y] = Array(12).fill(null).map(() => ({
        totalVolume: 0,
        count: 0
      }));
    }

    for (const bid of bids) {
      const d = new Date(bid.CloseDate);
      const y = d.getFullYear();
      const m = d.getMonth();

      if (result[y]) {
        const amount = Number(bid.WinningBid || 0);
        result[y][m].totalVolume += amount;
        result[y][m].count += 1;
      }
    }

    for (const y of years) {
      for (let m = 0; m < 12; m++) {
        const entry = result[y][m];
        entry.avgBid = entry.count > 0 ? entry.totalVolume / entry.count : 0;
      }
    }

    return result;
  }

  /* Build datasets for Chart.js */
  private buildDatasets(grouped: any, field: string) {
    const colors: Record<string, string> = {      
      '2014': '#64b5f6',
      '2015': '#81c784',
      '2016': '#ffb74d'      
    };

    return Object.keys(grouped).map(year => ({
      label: year,
      data: grouped[year].map((m: any) => m[field] || 0),
      borderColor: colors[year],
      fill: false,
      tension: 0.2
    }));
  }
}

import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})

export class SalesReportComponent {
  TotalOrder: number = 81;
  CustomerGrowth: number = 20;
  TotalRevenue: number = 82;

  ngAfterViewInit() {
    const ctx = document.getElementById('TotalOrder') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Progress', 'Remaining'],
        datasets: [
          {
            data: [this.TotalOrder, 100 - this.TotalOrder],
            backgroundColor: ['#FF5B5B', '#FF5B5B26'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '80%',
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
        },
      },
    });
    const ctx2 = document.getElementById('CustomerGrowth') as HTMLCanvasElement;

    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Progress', 'Remaining'],
        datasets: [
          {
            data: [this.CustomerGrowth, 100 - this.CustomerGrowth],
            backgroundColor: ['#1B9644', '#00B07426'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '80%',
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
        },
      },
    });
    const ctx3 = document.getElementById('TotalRevenue') as HTMLCanvasElement;

    new Chart(ctx3, {
      type: 'doughnut',
      data: {
        labels: ['Progress', 'Remaining'],
        datasets: [
          {
            data: [this.TotalRevenue, 100 - this.TotalRevenue],
            backgroundColor: ['#2D9CDB', '#2D9CDB26'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '80%',
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
        },
      },
    });

    const ctx4 = document.getElementById('OrderChart') as HTMLCanvasElement;
    new Chart(ctx4, {
      type: 'line',
      data: {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [
          {
            fill: true,
            data: [60, 40, 30, 60, 80, 90, 70],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    const ctx5 = document.getElementById('CustomerChart') as HTMLCanvasElement;
    new Chart(ctx5, {
      type: 'bar',
      data: {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        datasets: [
          {
            label: 'Customer',
            data: [20, 30, 80, 20, 50, 30, 4],
            backgroundColor: 'rgba(72, 187, 120, 0.8)'
          }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          // y: {
          //   grid: {
          //     display: false,
          //   },
          // },
        },
      }
    });

    const ctx6 = document.getElementById('TotalRevenueChart') as HTMLCanvasElement;
    new Chart(ctx6, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: '2022',
            data: [20, 40, 50, 60, 80, 90, 70, 60, 100],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.4,
          },
          {
            label: '2023',
            data: [78, 40, 65, 55, 61, 30, 70, 60, 57, 25, 98],
            borderColor: '#1B6D96',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              borderRadius: 5,
              boxWidth: 10,
              boxHeight: 10,
              useBorderRadius: true
            }
          },
        },
        scales: {
          y: {
            grid: {
              display: false,
            },
          },
          x: {
            grid: {
              display: true
            },
          },
        },
      },
    });
  }
}

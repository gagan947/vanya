import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  userInfo: any
  role: string | null | undefined
  data: any;

  constructor(
    private service: SharedService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
    this.getUserInfo()
    this.getDashboardData()
  }

  public getUserInfo() {
    let apiUrl = `getUserRoleProfile`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.userInfo = res.userDetails[0]
      } else {
        // this.toastr.error(res.message)
      }
    })
  }

  getDashboardData() {
    let apiUrl = `admin/getadminDashboardDetails`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.finalDashboard
      } else {
        // this.toastr.error(res.message)
      }
    })
  }

  projects = [
    { name: 'Farmer Greenfield', status: 'Active', credits: 120 },
    { name: 'Project Meadow', status: 'Under Review', credits: 105 },
    { name: 'Project Greenfield', status: 'Active', credits: 195 },
    { name: 'Project Workflow', status: 'Active', credits: 112 }
  ];

  users = [
    {
      registration: 'johnDoe1',
      seller: 'Farmer Greenfield',
      buyer: 'BuyerCorp Ltd.'
    },
    {
      registration: 'johnDoe2',
      seller: 'Farmer Greenfield',
      buyer: 'BuyerCorp Ltd.'
    },
    {
      registration: 'johnDoe3',
      seller: 'Farmer Greenfield',
      buyer: 'BuyerCorp Ltd.'
    }
  ];

  ngAfterViewInit() {
    const ctx = document.getElementById('impactChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: '',
            fill: true,
            data: [20, 40, 50, 60, 80, 90, 70, 60, 100],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        interaction: {
          intersect: false
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              color: '#f3f4f6',
            },
          },
        },
      },
    });

    const ctx2 = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        datasets: [
          {
            label: 'Project',
            data: [2, 3, 4, 2, 5, 3, 4],
            backgroundColor: 'rgba(72, 187, 120, 0.8)'
          },
          {
            label: 'Region',
            data: [1, 2, 1, 3, 4, 2, 1],
            backgroundColor: 'rgba(59, 130, 246, 0.8)'
          },
          {
            label: 'Category',
            data: [3, 1, 2, 4, 3, 5, 4],
            backgroundColor: 'rgba(234, 88, 12, 0.8)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }
}

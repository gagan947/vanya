import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent {

  userInfo: any
  role: string | null | undefined
  data: any;
  salesdata: any[] = [];
  projectsdata: any[] = [];

  constructor(
    private service: SharedService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
    this.getUserInfo();
    this.getDashboardData();
    this.getProjectSales();
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
    let apiUrl = `seller/getSellerDashboardDetails`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.sellerDetails
      } else {
        // this.toastr.error(res.message)
      }
    })
  }

  getProjectSales() {
    let apiUrl = `seller/getSellerProjectSales`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.salesdata = [res.salesTable]
        this.projectsdata = [res.projectTable]
      } else {
        // this.toastr.error(res.message)
      }
    })
  }

  ngAfterViewInit() {
    const ctx = document.getElementById('impactChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: '',
            data: [20, 40, 50, 60, 80, 90, 70, 60, 100],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.4,
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
  }
}

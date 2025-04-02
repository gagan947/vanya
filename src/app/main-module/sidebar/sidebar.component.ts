import { Component } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'
import { SharedService } from 'src/app/services/shared.service'
import { SidebarDataService } from 'src/app/services/sidebar-data.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  userInfo: any
  imageUrl: string = 'assets/images/profile_logo.jpg'
  isSidebarShow: boolean = true
  sidebarItems: any
  role: string | null | undefined
  baseUrl = environment.imgUrl
  constructor(
    private service: SharedService,
    public authService: AuthService,
    private sidebarDataService: SidebarDataService
  ) { }

  ngOnInit() {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })

    this.service.sidebarState$.subscribe(state => {
      this.isSidebarShow = state;
    });

    this.sidebarDataService.getSidebarItems().subscribe(items => {
      this.sidebarItems = items
    })
    this.getUserInfo()
  }

  public getUserInfo() {
    let apiUrl = `getUserRoleProfile`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.userInfo = res.userDetails[0]
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      } else {
        // this.toastr.error(res.message)
      }
    })
  }
}

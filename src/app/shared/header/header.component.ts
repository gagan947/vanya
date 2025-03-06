import { Component, effect, EventEmitter, Output } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  cartItems: any[] = [];
  constructor(private service: SharedService,
    public auth: AuthService
  ) {
    effect(() => {
      this.cartItems = this.service._cartItems();
    })
  }

  ngOnInit() {
    // this.loading = true
    let formData = new URLSearchParams()
    this.service.postWithToken(`cart/getCartItems`, formData).subscribe({
      next: async res => {
        if (res.success === true) {
          this.cartItems = res.projectData.reduce((acc: any[], project: { id: any }) => {
            if (project.id) {
              const matchingResult = res.result.find(
                (r: { project_id: any }) => r.project_id === project.id
              )
              if (matchingResult) {
                acc.push({ ...project, ...matchingResult })
              }
            }
            return acc
          }, [])
          this.service.setCartItems(this.cartItems)
          // this.loading = false
        } else {
          // this.loading = false
          this.service.setCartItems([])
        }
      },
      error: err => {
        // this.loading = false
        this.service.setCartItems([])
      }
    })
  }

  onCartClick() {
    this.service.AClicked(true)
  }

  toggle() {
    this.service.toggleSidebar();
  }
}

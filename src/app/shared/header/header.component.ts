import { Component, EventEmitter, Output } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private service: SharedService,
    public auth: AuthService
  ) { }

  ngOnInit() { }

  onCartClick() {
    this.service.AClicked(true)
  }

  toggle() {
    this.service.toggleSidebar();
  }
}

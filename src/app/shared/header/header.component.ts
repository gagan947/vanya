import { Component, EventEmitter, Output } from '@angular/core'
import { SharedService } from 'src/app/services/shared.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor (private service: SharedService) {}

  ngOnInit () {}

  onCartClick () {
    this.service.AClicked(true)
  }
}

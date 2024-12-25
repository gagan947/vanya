import { Component } from '@angular/core'
import { Title } from 'chart.js/dist'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vanya'

  ngOnInit() {
    window.onbeforeunload = () => {
      localStorage.removeItem('address')
    }
  }
}

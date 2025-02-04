import { Component } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vanya'


  constructor(private router: Router) { }

  ngOnInit() {
    window.onbeforeunload = () => {
      localStorage.removeItem('address')
    }
  }
}

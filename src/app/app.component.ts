import { Component } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vanya'


  constructor(private router: Router, private service: SharedService) { }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && window.innerWidth < 768) {
        this.service.close(false)
      }
    });

    window.onbeforeunload = () => {
      localStorage.removeItem('address')
    }
  }
}

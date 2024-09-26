import { HttpClient, HttpHeaders } from '@angular/common/http'
import { EventEmitter, Injectable, Output } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() aClickedEvent = new EventEmitter<string>()

  constructor (
    private http: HttpClient,
    private route: Router,
    private authService: AuthService
  ) {}

  get (url: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('authorization', `Bearer ${this.authService.getToken()}`)
    return this.http.get(environment.baseUrl + url, { headers: headers })
  }

  postWithToken (url: any, data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Access-Control-Allow-Origin', '*')
      .set('authorization', `Bearer ${this.authService.getToken()}`)
    return this.http.post(environment.baseUrl + url, data, { headers: headers })
  }

  post (url: any, data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('authorization', `Bearer ${this.authService.getToken()}`)
    return this.http.post(environment.baseUrl + url, data, { headers: headers })
  }

  upload (url: any, data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('authorization', `Bearer ${this.authService.getToken()}`)
    return this.http.post(environment.baseUrl + url, data, { headers: headers })
  }

  createProject (url: any, data: any): Observable<any> {
    return this.http.post(environment.baseUrl + url, data)
  }

  AClicked (value: any) {
    this.aClickedEvent.emit(value)
  }
}

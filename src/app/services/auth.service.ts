import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import * as CryptoJS from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl

  private authState = new BehaviorSubject<{
    isLoggedIn: boolean
    role: string | null
  }>({
    isLoggedIn: this.isLogedIn(),
    role: this.getRole()
  })
  authState$ = this.authState.asObservable()

  constructor (private http: HttpClient, private route: Router) {}
  setToken (token: string) {
    localStorage.setItem('token', token)
    this.updateAuthState(true, this.getRole())
  }

  getToken () {
    return localStorage.getItem('token')
  }

  setRole (role: string) {
    const secretKey = 'Vanya@321'
    const encryptedRole = CryptoJS.AES.encrypt(role, secretKey).toString()

    localStorage.setItem('role', encryptedRole)
    this.updateAuthState(this.isLogedIn(), role)
  }

  getRole (): string | null {
    const secretKey = 'Vanya@321'
    const encryptedRole = localStorage.getItem('role')

    if (encryptedRole) {
      const bytes = CryptoJS.AES.decrypt(encryptedRole, secretKey)
      return bytes.toString(CryptoJS.enc.Utf8)
    }

    return null
  }

  isLogedIn () {
    return this.getToken() !== null
  }

  updateAuthState (isLoggedIn: boolean, role: string | null) {
    this.authState.next({ isLoggedIn, role })
  }

  post (url: any, data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Access-Control-Allow-Origin', '*')
    return this.http.post<any>(this.baseUrl + url, data, { headers: headers })
  }

  logout (): void {
    localStorage.clear()
    this.updateAuthState(false, null)
    this.route.navigate(['/'])
  }
}

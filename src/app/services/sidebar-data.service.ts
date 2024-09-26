// sidebar-data.service.ts
import { Injectable } from '@angular/core'
import { AuthService } from './auth.service'
import { map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SidebarDataService {
  private sidebarItems = {
    Approver: [
      { label: 'Dashboard', link: '/fgsg', icon: 'view-dashboard-outline' },
      {
        label: 'User List',
        link: '/main/dashboard/users',
        icon: 'users-group-outline'
      },
      {
        label: 'Project List',
        link: '/main/dashboard/projects',
        icon: 'clipboard-list-outline'
      },
      { label: 'Transaction History', link: '/hdgh', icon: 'bank-transfer' },
      { label: 'Sales Report', link: '/dgfh', icon: 'report-line' },
      { label: 'Certificates', link: '/tey', icon: 'certificate' },
      {
        label: 'Marketplace',
        link: '/marketplace/projects',
        icon: 'marketplace-outline'
      },
      {
        label: 'Profile',
        link: '/main/dashboard/account-setting',
        icon: 'user-circle-outline'
      },
      { label: 'Settings', link: '/ghjfghj', icon: 'settings-outline' }
    ],

    Seller: [
      { label: 'Dashboard', link: '/tfk', icon: 'view-dashboard-outline' },
      {
        label: 'Project List',
        link: '/main/dashboard/projects',
        icon: 'clipboard-list-outline'
      },
      { label: 'Transaction History', link: '/u7t', icon: 'bank-transfer' },
      { label: 'Sales Report', link: '/srr', icon: 'report-line' },
      { label: 'Certificates', link: '/utu', icon: 'certificate' },
      {
        label: 'Marketplace',
        link: '/marketplace/projects',
        icon: 'marketplace-outline'
      },
      {
        label: 'Profile',
        link: '/main/dashboard/account-setting',
        icon: 'user-circle-outline'
      },
      { label: 'Settings', link: '/ryrtr', icon: 'settings-outline' }
    ],

    Buyer: [
      {
        label: 'Dashboard',
        link: '/fffs',
        icon: 'view-dashboard-outline'
      },
      {
        label: 'Project History',
        link: '/my-orders',
        icon: 'clipboard-text-history-outline'
      },
      { label: 'Credit History', link: '/res', icon: 'history' },
      { label: 'Certificates', link: '/fdfds', icon: 'certificate' },
      {
        label: 'Marketplace',
        link: '/marketplace/projects',
        icon: 'marketplace-outline'
      },
      { label: 'Invoices', link: '/iuyh', icon: 'invoice-receive-outline' },
      {
        label: 'Profile',
        link: '/main/dashboard/account-setting',
        icon: 'user-circle-outline'
      },
      { label: 'Settings', link: '/drs', icon: 'settings-outline' }
      // { label: 'Logout', link: '/', icon: 'logout' }
    ]
  }

  constructor (private authService: AuthService) {}
  getSidebarItems (): Observable<{ label: string; link: string }[]> {
    return this.authService.authState$.pipe(
      map(res => {
        const roleName = this.getValidRoleName(res.role)
        return this.sidebarItems[roleName] || []
      })
    )
  }

  getValidRoleName (role: string | null): RoleName {
    const validRoles: RoleName[] = ['Approver', 'Seller', 'Buyer']
    return validRoles.includes(role as RoleName) ? (role as RoleName) : 'Buyer'
  }
}
type RoleName = 'Approver' | 'Seller' | 'Buyer'

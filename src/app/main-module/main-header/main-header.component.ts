import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { EthereumService } from 'src/app/services/ethereum.service'

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent {
  isMetamaskConnected = false
  loading = false
  walletAddress: any
  maskedAddress: any
  address: any

  constructor (
    private router: Router,
    private ethereumService: EthereumService,
    private toastr: ToastrService
  ) {
    this.address = localStorage.getItem('address')
    if (this.address) {
      this.isMetamaskConnected = true
    }

    this.showAdd()
  }

  showAdd () {
    // this.address = localStorage.getItem('address')
    // const fullAddress: any = this.address
    // if (fullAddress) {
    //   const start = fullAddress.substring(0, 6)
    //   const end = fullAddress.substring(fullAddress.length - 4)
    //   this.maskedAddress = `${start}...${end}`
    // } else {
    //   console.error('Wallet address not found in localStorage')
    // }
  }

  connectToMetaMask (): void {
    this.loading = true
    this.ethereumService
      .connectAccount()
      .then(() => {
        const address = localStorage.getItem('address')
        if (!address) {
          this.isMetamaskConnected = false
          this.loading = false
          return
        } else {
          this.isMetamaskConnected = true
          this.showAdd()
          //this.walletAddress = JSON.stringify(localStorage.getItem('address'))
        }
        this.loading = false
        this.isMetamaskConnected = true
      })
      .catch(error => {
        this.loading = false
        this.isMetamaskConnected = false
        this.toastr.error('Something went wrong.')
        console.error('Error connecting to MetaMask', error)
      })
  }
}

import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog'
import { MessageDialogComponent } from 'src/app/marketplace/message-dialog/message-dialog.component'
import { AuthService } from 'src/app/services/auth.service'
import { SharedService } from 'src/app/services/shared.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  loading: boolean = false
  baseUrl = environment.imgUrl
  cartItems: any
  sidebarVisible2: boolean = false
  ref: DynamicDialogRef | undefined
  private cashfree: any;
  userDetails: any
  role: string | null | undefined
  constructor(
    private router: Router,
    private service: SharedService,
    private toastr: NzMessageService,
    private dialogService: DialogService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
    this.loadCashfreeSDK().then(() => {
      this.cashfree = window['Cashfree']({ mode: 'sandbox' });
    });

    this.service.aClickedEvent.subscribe((data: boolean) => {
      this.sidebarVisible2 = data
    })
    this.getCartItems()

    // this.service.get('getUserRoleDetails').subscribe(res2 => {
    //   this.userDetails = res2.userRoles
    // })
  }



  getCartItems() {
    this.loading = true

    let formData = new URLSearchParams()
    // formData.set('id', '')

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
          this.loading = false
        } else {
          this.loading = false
          this.service.setCartItems([])
        }
      },
      error: err => {
        this.loading = false
        this.service.setCartItems([])
      }
    })
  }

  increment(item: any) {
    if (Number(item.carbon_credits) <= item.remaining_credit) {
      item.carbon_credits = Number(item.carbon_credits) + 1

      let apiUrl = 'cart/updateCart'
      let formData = new URLSearchParams()
      formData.set('project_id', item.project_id)
      formData.set('carbon_credits', item.carbon_credits)
      formData.set('price_per_carbon_credit', '2000')
      formData.set('total_price_of_project', '1000')
      formData.set('cart_id', item.id)

      this.service.postWithToken(apiUrl, formData).subscribe({
        next: async res => {
          if (res.success === true) {
            this.loading = false
          } else {
            this.loading = false
          }
        },
        error: err => {
          this.loading = false
        }
      })
    }
  }

  decrement(item: any) {
    if (Number(item.carbon_credits) > 1) {
      item.carbon_credits = Number(item.carbon_credits) - 1

      let apiUrl = 'cart/updateCart'
      let formData = new URLSearchParams()
      formData.set('project_id', item.project_id)
      formData.set('carbon_credits', item.carbon_credits)
      formData.set('price_per_carbon_credit', '2000')
      formData.set('total_price_of_project', '1000')
      formData.set('cart_id', item.id)

      this.service.postWithToken(apiUrl, formData).subscribe({
        next: async res => {
          if (res.success === true) {
            this.loading = false
          } else {
            this.loading = false
          }
        },
        error: err => {
          this.loading = false
        }
      })
    }
  }

  deleteFromCart(pro_data: any) {
    let apiUrl = 'cart/deleteCartItemsByProject'
    let formData = new URLSearchParams()
    formData.set('project_id', pro_data.project_id)
    formData.set('cart_id', pro_data.id)

    this.service.postWithToken(apiUrl, formData).subscribe({
      next: async res => {
        if (res.success === true) {
          this.loading = false
          this.cartItems = []
          this.toastr.success(res.message)
          this.getCartItems()
        } else {
          this.loading = false
          this.toastr.error(res.message)
        }
      },
      error: err => {
        this.loading = false
        this.toastr.success(err)
      }
    })
  }

  checkOut(item: any) {
    this.loading = true
    let apiUrl = 'cart/checkOutOrderItemsPart1'

    for (const project of item) {
      if (project.carbon_credits > project.remaining_credit) {
        this.loading = false
        this.toastr.error(
          `Error: Carbon credits for project "${project.project_name}" exceed remaining credits.`
        )
        return
      }
    }
    const formattedData = {
      items: item
        .filter((project: { id: any }) => project.id)
        .map((project: any) => ({
          project_id: project.project_id,
          carbon_credits: Number(project.carbon_credits),
          price_per_carbon_credit: Number(project.price_per_carbon_credit),
          amount: Number(
            project.price_per_carbon_credit * project.carbon_credits
          ),
          cart_id: project.id
        }))
    }

    this.service.post(apiUrl, formattedData).subscribe({
      next: async res => {
        if (res.success === true) {

          let formData1 = {
            "total_amount": res.totalAmount,
            "order_id": res.orderId,
          }

          this.service.post('payment/createOrderPayment', formData1).subscribe({
            next: async res2 => {
              if (res2.success) {
                this.openCheckout(res2.data.payment_session_id, res)
              }
            }
          })
          // this.router.navigate(['/marketplace/projects'])
          // const msgData = {
          //   icon: 'success-circle-outline',
          //   title: 'Payment Done!',
          //   message: 'Thank you for completing your secure online payment.',
          //   message_1: 'Have a great day!',
          //   type: 'success'
          // }
          // this.showDialog(msgData)
        } else {
          this.loading = false
          // const msgData = {
          //   icon: 'error-outline',
          //   title: "Oops somthing wen't wrong!",
          //   message_1: 'you may try again!',
          //   type: 'error'
          // }
          // this.showDialog(msgData)
        }
      },
      error: err => {
        this.loading = false
        const msgData = {
          icon: 'error-outline',
          title: "Oops something wen't wrong!",
          message_1: 'you may try again!',
          type: 'error'
        }
        this.showDialog(msgData)
      }
    })
  }

  getTotal(cartData: any) {
    const totalAmount = cartData.reduce(
      (sum: any, currentItem: any) =>
        sum + currentItem.price_per_carbon_credit * currentItem.carbon_credits,
      0
    )
    return totalAmount
  }

  showDialog(Data: any) {
    this.ref = this.dialogService.open(MessageDialogComponent, {
      data: Data,
      header: '',
      showHeader: false,
      width: '90%',
      styleClass: 'bg-transparent p-2 rounded-lg shadow-md',
      dismissableMask: true
    })
  }

  close() {
    this.sidebarVisible2 = !this.sidebarVisible2
  }

  private loadCashfreeSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
      document.body.appendChild(script);
    });
  }

  openCheckout(sessionId: string, orderData: any): void {
    const paymentSessionId = sessionId
    const checkoutOptions = {
      paymentSessionId,
      redirectTarget: '_modal',
    };

    this.cashfree.checkout(checkoutOptions).then((result: any) => {
      if (result.error) {
        console.error('User has closed the popup or there is some payment error:', result.error);
        const msgData = {
          icon: 'error-outline',
          title: "Oops something wen't wrong!",
          message_1: result.error.message,
          type: 'error'
        }
        this.showDialog(msgData)
        this.loading = false
      } else if (result.redirect) {
        console.log('Payment will be redirected');
      } else if (result.paymentDetails) {
        // console.log('Payment has been completed. Check for Payment Status:', result.paymentDetails.paymentMessage);

        let formData = {
          "orderItems": [...orderData.orderItems],
          "order_id": orderData.orderId,
        }

        this.service.post('cart/checkOutOrderItemsPart2', formData).subscribe({
          next: async res2 => {
            if (res2.success) {
              this.clearCart()
              this.router.navigate(['/main/dashboard/credit-history'])
              const msgData = {
                icon: 'success-circle-outline',
                title: 'Payment Done!',
                message: 'Thank you for completing your secure online payment.',
                message_1: result.paymentDetails.paymentMessage,
                type: 'success'
              }
              this.showDialog(msgData)
              this.close()
              this.loading = false
            }
          }
        })
      }
    });
  }

  clearCart() {
    this.service.postWithToken('cart/deleteCartItemsByUser', '').subscribe({ next: async res => { } })
    this.cartItems = []
    this.service.setCartItems([])
  }
}

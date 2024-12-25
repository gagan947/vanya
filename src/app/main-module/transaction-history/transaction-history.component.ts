import { Component } from '@angular/core';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent {
  loading: boolean = false
  totalCount: any

  data = [
    {
      date: '2024-12-20',
      orderId: 'ORD001',
      buyer: 'John Doe',
      amount: 500,
      paymentMethod: 'Credit Card',
      status: 'Completed'
    },
    {
      date: '2024-12-21',
      orderId: 'ORD002',
      buyer: 'Jane Smith',
      amount: 1000,
      paymentMethod: 'PayPal',
      status: 'Pending'
    },
    {
      date: '2024-12-22',
      orderId: 'ORD003',
      buyer: 'Robert Brown',
      amount: 750,
      paymentMethod: 'Bank Transfer',
      status: 'Failed'
    }
  ];


  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  getStatusLabel(status: string): string {
    return status;
  }

  showDialog(id: string): void {
    console.log(`Viewing details for Order ID: ${id}`);
  }

  Delete(id: string, event: MouseEvent): void {
    event.stopPropagation();
    console.log(`Deleting Order ID: ${id}`);
  }

  first: number = 0
  rows: number = 10
  page: number = 0

  onPageChange(event: { first: number; rows: number; page: number }) {
    this.first = event.first
    this.rows = event.rows
    this.page = event.page
    // this.getUsersList()
  }
}

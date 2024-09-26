import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ethers } from 'ethers'
import { projectContractABI, storageContractABI2 } from '../main-module/ABI/abi'
import { ToastrService } from 'ngx-toastr'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EthereumService {
  private provider?: ethers.providers.Web3Provider
  public accountAddress?: any
  //private contractAddress = '0x211Db806225812247ad2054266469813590EF632';
  //contractAddress = localStorage.getItem('address');

  //form submit
  private contractAddress: any = undefined

  //getProjectAddress
  private contractAddress2 = '0x21f9CAb7B8caa98E96C86C37d7f78A807A8c7898'

  //form submit
  private projectContractABI: any = projectContractABI

  //private account: any;

  //getProjectAddress
  private storageContractABI2: any = storageContractABI2

  async initializeProvider (): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
    } else {
      console.error('MetaMask or similar provider not detected.')
      // Handle error or notify user accordingly
    }
  }

  async connectAccount (): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      if (!this.provider) {
        await this.initializeProvider()
      }
      try {
        // Request account access if needed
        this.accountAddress = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        //address//
        this.toastr.success('Wallet connected successfully.')
        localStorage.setItem('address', this.accountAddress[0])
      } catch (error) {
        this.toastr.error('User denied account access!')
        console.error('User denied account access')
      }
      // } else {
      //   localStorage.removeItem('address');
      //   this.toastr.error('MetaMask is not installed!')
    }
  }

  //get contract address
  async createProject () {
    const signer = await this.getSigner()
    const contract = new ethers.Contract(
      this.contractAddress2,
      this.storageContractABI2,
      signer
    )
    try {
      const tx = await contract['createProject']()
      const receipt = await tx.wait()

      const events = receipt.events?.filter(
        (e: { event: string }) => e.event === 'ProjectCreated'
      )
      const event = events && events[0]
      const addr = event && event.args?.projectContract
      if (addr) {
        //contract address//
        localStorage.setItem('contract address', addr)
        this.contractAddress = addr
      } else {
        this.toastr.error('Something went wrong. Address not available.')
      }
      return addr
    } catch (error) {
      console.error('Error submitting transaction:', error)
      throw error
    }
  }

  async getSigner () {
    if (!this.provider) {
      this.toastr.error('Please re-initialized the provider!')
      // this.toastr.error('Provider is not initialized. Call connectAccount first.!');
      throw new Error('Provider is not initialized. Call connectAccount first.')
    }
    return this.provider.getSigner()
  }

  // async sendTransactionToContract(
  //   latitude: string,
  //   longitude: string,
  //   projectAddress: string,
  //   details: string,
  //   area: string,
  //   ndvi: string,
  //   carbon: string,
  //   npar: string,
  //   par: string,
  //   kmlLink: string,
  //   geoJsonLink: string,
  //   projectDescription: string,
  //   firstImageLink: string,
  //   landDeveloper: string,
  //   projectStoryImage: string,
  //   projectType: string,
  //   carbonCredits: string,
  //   amountWorth: string,
  //   productName: string
  // ): Promise<void> {
  //   if (!this.provider || !this.accountAddress) {
  //     throw new Error('Provider or account address not available. Call connectAccount first.');
  //   }

  //   const signer = await this.getSigner();
  //   const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

  //   try {
  //     await contract['addProjectData'](
  //       latitude,
  //       longitude,
  //       projectAddress,
  //       details,
  //       area,
  //       ndvi,
  //       carbon,
  //       npar,
  //       par,
  //       kmlLink,
  //       geoJsonLink,
  //       projectDescription,
  //       firstImageLink,
  //       landDeveloper,
  //       projectStoryImage,
  //       projectType,
  //       carbonCredits,
  //       amountWorth,
  //       productName
  //     )
  //   } catch (error) {
  //     console.error('Error sending transaction to contract', error);
  //   }
  // }

  //private signer: ethers.Signer;
  // private contract: ethers.Contract;
  // private signer?: ethers.Signer;

  constructor (private http: HttpClient, private toastr: ToastrService) {
    if (!this.provider) {
      this.initializeProvider()
    }
  }

  async sendTransactionToContract (
    latitude: string,
    longitude: string,
    projectAddress: string,
    details: string,
    area: string,
    ndvi: string,
    carbon: string,
    npar: string,
    par: string,
    kmlLink: string,
    geoJsonLink: string,
    projectDescription: string,
    firstImageLink: string,
    landDeveloper: string,
    projectStoryImage: string,
    projectType: string,
    carbonCredits: string,
    amountWorth: string,
    productName: string
  ) {
    const signer = await this.getSigner()
    const contract = new ethers.Contract(
      this.contractAddress,
      this.projectContractABI,
      signer
    )
    try {
      const tx = await contract['addProjectData'](
        latitude,
        longitude,
        projectAddress,
        details,
        area,
        ndvi,
        carbon,
        npar,
        par,
        kmlLink,
        geoJsonLink,
        projectDescription,
        firstImageLink,
        landDeveloper,
        projectStoryImage,
        projectType,
        carbonCredits,
        amountWorth,
        productName
      )
      const receipt = await tx.wait()

      const events = receipt.events?.filter(
        (e: { event: string }) => e.event === 'ProjectDataAdded'
      )
      const event = events && events[0]
      const id = event && event.args?.projectId
      if (id) {
        localStorage.setItem('projectId', id)
      }

      return id // Return the ID or any relevant data
    } catch (error) {
      this.toastr.error('Error submitting transaction')
      console.error('Error submitting transaction:', error)
      throw error // Rethrow or handle as needed
    }
  }
  // sendDet (owner: any, address: any): Observable<any> {
  //   return this.http.post<any>(`${environment.baseUrl}project/saveAddress`, {
  //     owner,
  //     address
  //   })
  // }
}

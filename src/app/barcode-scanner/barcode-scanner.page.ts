import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { IonicModule,ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.page.html',
  styleUrls: ['./barcode-scanner.page.scss'],
})
export class BarcodeScannerPage implements OnInit {
  @Input() barCode="";
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.scanBarcode()
  }



  async scanBarcode() {
    document.querySelector('body')?.classList.add('scanner-active');
    await BarcodeScanner.checkPermission({ force: true });
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      this.barCode = result.content;
      await this.modalController.dismiss({ barcode: this.barCode });
      document.querySelector('body')?.classList.remove('scanner-active');
    }
  }

  async closeScanner(){
    await BarcodeScanner.stopScan();

    // Close the modal
    await this.modalController.dismiss();
  }
  
}

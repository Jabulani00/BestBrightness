import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.page.html',
  styleUrls: ['./add-inventory.page.scss'],
})
export class AddInventoryPage implements OnInit {

  itemName: string = '';
  itemCategory: string = '';
  itemDescription: string = '';
  itemQuantity: number = 0;
  selectedFile: File | null = null;
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
  }
  
  async addItem() {
    if (this.selectedFile) {
      const filePath = 'images/' + this.selectedFile.name;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedFile);

      // Get download URL from observable and add timestamp
      uploadTask.snapshotChanges().pipe(
        finalize(async () => {
          const downloadURL = await fileRef.getDownloadURL().toPromise(); // Convert Observable to Promise

          const newItem = {
            name: this.itemName,
            category: this.itemCategory,
            description: this.itemDescription,
            imageUrl: downloadURL,
            quantity: this.itemQuantity,
            inCart: false,
            timestamp: new Date(), // Add timestamp
          };

          await this.firestore.collection('inventory').add(newItem);
          this.clearFields();
        })
      ).subscribe();
    } else {
      const newItem = {
        name: this.itemName,
        category: this.itemCategory,
        description: this.itemDescription,
        imageUrl: '',
        quantity: this.itemQuantity,
        inCart: false,
        timestamp: new Date(), // Add timestamp
      };

      await this.firestore.collection('inventory').add(newItem);
      this.clearFields();
    }
  }

  clearFields() {
    this.itemName = '';
    this.itemCategory = '';
    this.itemDescription = '';
    this.itemQuantity = 0;
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.selectedFile = inputElement.files[0];
    }
  }
}

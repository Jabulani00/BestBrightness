import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

 
  itemId!: string; // Variable to hold the ID of the inventory item
  itemName: string = '';
  itemCategory: string = '';
  itemDescription: string = '';
  itemQuantity: number = 0;
  selectedFile: File | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    // Get the item ID from route parameters
    this.route.params.subscribe(params => {
      this.itemId = params['id'];
      // Fetch the item details from Firestore using the item ID
      this.firestore.collection('inventory').doc(this.itemId).get().toPromise()
        .then(doc => {
          if (doc && doc.exists) {
            const data: any = doc.data();
            this.itemName = data.name;
            this.itemCategory = data.category;
            this.itemDescription = data.description;
            this.itemQuantity = data.quantity;
          } else {
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    });
  }
  
  async updateItem() {
    if (this.selectedFile) {
      const filePath = 'images/' + this.selectedFile.name;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedFile);

      // Get download URL from observable and add timestamp
      uploadTask.snapshotChanges().pipe(
        finalize(async () => {
          const downloadURL = await fileRef.getDownloadURL().toPromise(); // Convert Observable to Promise

          // Update item details in Firestore
          await this.firestore.collection('inventory').doc(this.itemId).update({
            name: this.itemName,
            category: this.itemCategory,
            description: this.itemDescription,
            imageUrl: downloadURL,
            quantity: this.itemQuantity,
            timestamp: new Date(), // Add timestamp
          });
        })
      ).subscribe();
    } else {
      // Update item details in Firestore without updating the image
      await this.firestore.collection('inventory').doc(this.itemId).update({
        name: this.itemName,
        category: this.itemCategory,
        description: this.itemDescription,
        quantity: this.itemQuantity,
        timestamp: new Date(), // Add timestamp
      });
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

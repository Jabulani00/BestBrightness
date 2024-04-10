import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-storeroom',
  templateUrl: './storeroom.page.html',
  styleUrls: ['./storeroom.page.scss'],
})
export class StoreroomPage implements OnInit {

  inventory: any[] = []; // Initialize here

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.getInventory();
  }

  getInventory() {
    this.firestore.collection('storeroomInventory', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data: any[]) => {
      this.inventory = data;
    });
  }
}

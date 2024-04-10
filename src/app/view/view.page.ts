import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  ViewChild, ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  inventory: any[] = []; // Initialize here

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.getInventory();
  }

  getInventory() {
    this.firestore.collection('inventory', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data: any[]) => {
      this.inventory = data;
    });
  }
}

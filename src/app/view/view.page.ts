import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  inventory: any[] = []; // Initialize here

  constructor(private firestore: AngularFirestore,private router: Router) { }

  ngOnInit() {
    this.getInventory();
  }

  getInventory() {
    this.firestore.collection('inventory', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data: any[]) => {
      this.inventory = data;
    });
  }
  goToUpdate(name:any,category:any,description:any,quantity:any,barcode:any,pickersDetails:any,dateOfPickup:any,timeOfPickup :any,imageUrl:any){
    let navi: NavigationExtras = {
      state: {
        name: name,
        category: category,
        description: description,
        imageUrl: imageUrl || '',
        quantity: quantity,
        pickersDetails: pickersDetails,
        dateOfPickup: dateOfPickup,
        timeOfPickup: timeOfPickup,
        barcode:barcode || '',
      },
   };
   this.router.navigate(['/update'], navi);
   }







  }





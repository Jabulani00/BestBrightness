import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) {}
  navigateToAddInventory() {
    this.router.navigate(['/add-inventory']);
  }

  navigateToUpdateInventory() {
    this.router.navigate(['/update-inventory']);
  }

  navigateToPickupInventory() {
    this.router.navigate(['/pickup-inventory']);
  }

  navigateToDeliverInventory() {
    this.router.navigate(['/deliver-inventory']);
  }

}

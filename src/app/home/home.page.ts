import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userDocument: any;

  constructor(private navCtrl: NavController,
              private router: Router,
              private auth: AngularFireAuth,
              private db: AngularFirestore,
              private toastController: ToastController) {}

  async getUser(): Promise<void> {
    const user = await this.auth.currentUser;

    if (user) {
      try {
        const querySnapshot = await this.db
          .collection('Users')
          .ref.where('email', '==', user.email)
          .get();

        if (!querySnapshot.empty) {
          this.userDocument = querySnapshot.docs[0].data();
          console.log('User Document:', this.userDocument); // Log user document
        }
      } catch (error) {
        console.error('Error getting user document:', error);
      }
    }
  }

  async navigateBasedOnRole(page: string): Promise<void> {
    try {
      await this.getUser();

      let authorized = false;
      let message = '';

      if (this.userDocument && this.userDocument.role) {
        console.log('User Role:', this.userDocument.role); // Log user role

        switch (page) {
          case 'pickup':
            authorized = this.userDocument.role === 'picker';
            message = 'Unauthorized user for picker page.';
            break;
          case 'delivery':
            authorized = this.userDocument.role === 'Deliver';
            message = 'Unauthorized user for delivery page.';
            break;
          case 'add-inventory':
            authorized = this.userDocument.role === 'Manager';
            message = 'Access denied to add inventory page.';
            break;
          case 'update':
            authorized = this.userDocument.role === 'Manager';
            message = 'Unauthorized user for updating page.';
            break;
          default:
            authorized = false;
            message = 'Invalid page.';
            break;
        }
      }

      if (authorized) {
        this.navCtrl.navigateForward('/' + page);
      } else {
        const toast = await this.toastController.create({
          message: 'Unauthorized Access: You do not have the necessary permissions to access this page. Please contact the administrator for assistance.',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    } catch (error) {
      console.error('Error navigating based on role:', error);
    }
  }

  navigateToAddInventory(): Promise<void> {
    return this.navigateBasedOnRole('add-inventory');
  }

  navigateToUpdateInventory(): Promise<void> {
    return this.navigateBasedOnRole('update');
  }

  navigateToPickupInventory(): Promise<void> {
    return this.navigateBasedOnRole('pickup');
  }

  navigateToDeliverInventory(): Promise<void> {
    return this.navigateBasedOnRole('delivery');
  }
}

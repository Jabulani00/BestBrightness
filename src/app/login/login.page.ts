import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import firebase from 'firebase/compat/app'; // Import firebase app
import 'firebase/compat/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: any;
  password: any;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private controller: NavController,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController // Inject ToastController
  ) {}

  ngOnInit() {}

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  async login() {
    if (this.password == '') {
      this.presentToast('Enter password', 'danger');
      return;
    }

    const loader = await this.loadingController.create({
      message: '|Logging in...',
      cssClass: 'custom-loader-class'
    });
    await loader.present();

    // Query Firestore to find the document with the matching email
    const userQuerySnapshot = await firebase.firestore()
      .collection('Users')
      .where('email', '==', this.email)
      .get();

    if (userQuerySnapshot.empty) {
      loader.dismiss();
      this.presentToast('User does not exist', 'danger');
      return;
    }

    // Since email is unique, there should be only one document in the query snapshot
    const userData = userQuerySnapshot.docs[0].data();

    if (userData && userData['status'] === 'active') {
      this.auth.signInWithEmailAndPassword(this.email, this.password)
        .then(userCredential => {
          loader.dismiss();
          const user = userCredential.user;
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          loader.dismiss();
          const errorMessage = error.message;
          this.presentToast(errorMessage, 'danger');
        });
    } else if (userData && userData['status'] === 'denied') {
      loader.dismiss();
      this.presentToast('You are not allowed in the system', 'danger');
    } else {
      loader.dismiss();
      this.presentToast('You are not allowed in the system', 'danger');
    }
  }
}

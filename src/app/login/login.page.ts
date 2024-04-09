import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, NavController } from '@ionic/angular';
import firebase from 'firebase/compat/app'; // Import firebase app
import 'firebase/compat/firestore';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
email:any;
password:any;

  constructor(private router: Router,private loadingController: LoadingController,private controller: NavController,
    private auth : AngularFireAuth,private firestore: AngularFirestore) { }

  ngOnInit() {
  }

  async login() {
    if (this.password =='') {
      alert("Enter password");
      return;
    }
  
    const loader = await this.loadingController.create({
      message: '|Logging in...',
      cssClass: 'custom-loader-class'
    });
  
    // Query Firestore to find the document with the matching email
    const userQuerySnapshot = await firebase.firestore().collection('Users').where('email', '==', this.email).get();
  
    if (userQuerySnapshot.empty) {
      this.loadingController.dismiss();
      window.alert("User does not exist");
      return;
    }
  
    // Since email is unique, there should be only one document in the query snapshot
    const userData = userQuerySnapshot.docs[0].data();
  
    if (userData && userData['status'] === 'active') {
      this.auth.signInWithEmailAndPassword(this.email, this.password)
        .then(userCredential => { 
          this.loadingController.dismiss();
          const user = userCredential.user;
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          this.loadingController.dismiss();
          const errorMessage = error.message;
          window.alert(errorMessage);
        });
    } else if (userData && userData['status'] === 'denied') {
      this.loadingController.dismiss();
      window.alert("You are not allowed in the system");
    } else {
      this.loadingController.dismiss();
      window.alert("User status unknown");
    }
  }
  
  
} 

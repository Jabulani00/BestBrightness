import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router'; // Import Router
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  name: any;
  email: any;
  password: any;
  confirm_password: any;

  constructor(
    private db: AngularFirestore,
    private Auth: AngularFireAuth,
    private router: Router // Inject Router
  ) { }

  ngOnInit() {
  }

  Register() {
    if (this.password !== this.confirm_password) {
      console.error('Passwords do not match');
      return;
    }

    const userData = {
      firstname: this.name,
      email: this.email,
      password: this.password,
    };

    this.Auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential: any) => { // Explicitly specify type
        if (userCredential.user) {
          this.db.collection('Users').add(userData)
            .then(() => {
              console.log('User data added successfully');
              this.router.navigate(['/login']); // Move navigate call inside then block
            })
            .catch((error: any) => { // Explicitly specify type
              console.error('Error adding user data:', error);
            });
        } else {
          console.error('User credential is missing');
        }
      })
      .catch((error: any) => { // Explicitly specify type
        console.error('Error creating user:', error);
      });
  }
  
  
}

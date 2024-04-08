import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, NavController } from '@ionic/angular';
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

 


    if (this.email =='') 
    {
      alert("Enter email Address")
      return;
    }
    if (this.password =='') 
    {
      alert("Enter password")
      return;
    }  
    const loader = await this.loadingController.create({
      message: '|Logging in...',
      cssClass: 'custom-loader-class'
    });

  this.auth.signInWithEmailAndPassword(this.email, this.password)
  .then(userCredential => { 
    this.loadingController.dismiss();
    const user = userCredential.user;
    this.router.navigate(['/home']);
  })
  .catch((error) => {
    this.loadingController.dismiss();
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert(errorMessage);
   
  });


   

 } 
} 

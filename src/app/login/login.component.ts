import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router:Router, @Inject(PLATFORM_ID) private platformId: Object){}

  email: string = '';
  pass: string = '';
  erreur: boolean = false;
  identifiantErreur:boolean =false;

  async onLogin(){

    if(!this.email || !this.pass){
      this.erreur=true;
    }
    const body={
      eamil:this.email,
      password:this.pass
    }

    await this.authService.Login(body).subscribe({
      next: (response) => {
        console.log(response);

        if (response.statusCode === 401) {
          this.identifiantErreur = true;
        }

        if (response.statusCode === 201) {
          // Stocke un token ou un indicateur de connexion (ex: dans localStorage)
          if(isPlatformBrowser(this.platformId)){
            localStorage.setItem('authToken', response.token);
            this.router.navigate([`/dashboard/`, response.AuthId]);
          }

        }
      }
    });

  }

  register(){
    this.router.navigate([`/register`]);
  }


}

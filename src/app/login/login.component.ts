import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  constructor(private authService: AuthService, private router:Router){}

  email: string = '';
  pass: string = '';

  async onLogin(){
    const body={
      eamil:this.email,
      password:this.pass
    }

    const login= await this.authService.Login(body).subscribe({
      next:(response)=>{
        console.log(response)
        this.router.navigate([`/dashboard/`, response.AuthId]);
      }
    })
  }


}

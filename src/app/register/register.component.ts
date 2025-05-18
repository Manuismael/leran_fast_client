import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private authService:AuthService, private router:Router,){}
  nom: string = '';
  prenom: string = '';
  email: string = '';
  pass: string = '';

  async onRegistered(){
    console.log("okkkk")
    const body={
      nom:this.nom,
      prenom:this.prenom,
      email: this.email,
      password: this.pass
    }
    console.log(body)
    const register= await this.authService.Register(body).subscribe({
      next:(response)=>{
        this.router.navigate(['/login'])
      }
    });
    return register;
  }
}

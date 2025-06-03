import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router:Router, @Inject(PLATFORM_ID) private platformId: Object){}

  logout() {
    if(isPlatformBrowser(this.platformId)){
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }
  }


}

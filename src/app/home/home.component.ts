import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router:Router, @Inject(PLATFORM_ID) private platformId: Object){}

    ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const phrases = [
        "t'aide à réviser vite.",
        "simplifie tes révisions.",
        "crée des quiz sur mesure.",
        "est basée sur Gemini.",
        "corrige tes erreurs.",
        "booste ta mémoire.",
        "rend la révision fun.",
        "t'explique chaque réponse.",
        "s'adapte à ton niveau.",
        "te fait gagner du temps.",
        "te prépare aux examens."
      ];

      const typingText = document.getElementById('typing-text')!;
      let phraseIndex = 0;
      let charIndex = 0;
      const typingSpeed = 100;
      const pauseBetweenPhrases = 1000;

      function type() {
        if (charIndex < phrases[phraseIndex].length) {
          typingText.textContent += phrases[phraseIndex].charAt(charIndex);
          charIndex++;
          setTimeout(type, typingSpeed);
        } else {
          setTimeout(erase, pauseBetweenPhrases);
        }
      }

      function erase() {
        if (charIndex > 0) {
          typingText.textContent = typingText.textContent!.slice(0, -1);
          charIndex--;
          setTimeout(erase, typingSpeed / 2);
        } else {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, typingSpeed);
        }
      }

      setTimeout(type, pauseBetweenPhrases);
    }
  }

  register(){
    this.router.navigate([`/register`]);
  }

}

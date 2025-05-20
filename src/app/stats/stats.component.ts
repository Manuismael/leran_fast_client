import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  stats: any[] = [];
  id_user:number= 0;

  constructor(private quizService:QuizService, @Inject(PLATFORM_ID) private platformId: Object, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.id_user = +(this.route.snapshot.paramMap.get('id_user') || 'null');
    if (isPlatformBrowser(this.platformId)) {
      this.quizService.statQuiz(this.id_user).subscribe(data => {
        this.stats = data;
      });
    }
  }
}

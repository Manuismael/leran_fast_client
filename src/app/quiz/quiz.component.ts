import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  questions: any[] = [];
  currentIndex = 0;
  score = 0;
  timer = 30;
  intervalId: any;
  showResult = false;
  selectedOption: any;
  showExplanation = false;

  constructor(private quizService: QuizService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.quizService.getQuiz().subscribe(data => {
        this.questions = data.question;
      });
    }
  }


  startTimer() {
    this.timer = 30;
    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.nextQuestion();
      }
    }, 1000);
  }

  selectOption(option: any) {
    if (!this.selectedOption) {
      this.selectedOption = option;
      if (option.correct) this.score += 10;
      this.showExplanation = true;
    }
  }

  nextQuestion() {
    clearInterval(this.intervalId);
    this.selectedOption = null;
    this.showExplanation = false;

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.startTimer();
    } else {
      this.showResult = true;
    }
  }

  resetQuiz() {
    this.currentIndex = 0;
    this.score = 0;
    this.showResult = false;
    this.ngOnInit();
  }

  
}

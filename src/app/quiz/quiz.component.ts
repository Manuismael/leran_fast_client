import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  questions: any[] = [];
  documents: any[] = [];
  currentIndex = 0;
  score = 0;
  timer = 30;
  intervalId: any;
  showResult = false;
  selectedOption: any;
  showExplanation = false;
  selectedDocument: number = 0;
  isLoading: boolean = false;

  actions:string='';
  id_user:number= 0;
  id_quiz:number= 0;

  constructor(private quizService: QuizService, @Inject(PLATFORM_ID) private platformId: Object, private route: ActivatedRoute,) {}

  ngOnInit(): void {
    this.id_user = +(this.route.snapshot.paramMap.get('id_user') || 'null');
    if (isPlatformBrowser(this.platformId)) {
      this.quizService.getSavedDocument(this.id_user).subscribe(data => {
        this.documents = data;
      });
    }
  }

  cleanDocumentName(path: string): string {
    // nettoyer un peu le nom des documents
    return path.replace(/^uploads\//, '').replace(/\.pdf$/, '');
  }

  async onSubmit() {
    await this.quizService.generateQuiz(this.selectedDocument, this.id_user).subscribe(data=>{
      this.questions = data.content.questions;
      if(this.questions){
        this.isLoading=true;
      }
      this.id_quiz = data.saved_quiz.Id_quiz
    })
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
      if (option.correct) this.score += 1;
      this.showExplanation = true;
    }
  }

  async nextQuestion() {
    clearInterval(this.intervalId);
    this.selectedOption = null;
    this.showExplanation = false;

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.startTimer();
    } else {
      this.showResult = true;
      const notes=this.score*100/this.questions.length

    //enregistrer le score final
    const body ={Id_user:this.id_user, Id_quiz:this.id_quiz, note:notes};
    await this.quizService.noteQuiz(body).subscribe(data => {
      console.log(data);
    });
    }
  }

  resetQuiz() {
    this.currentIndex = 0;
    this.score = 0;
    this.showResult = false;
    this.ngOnInit();
  }
}

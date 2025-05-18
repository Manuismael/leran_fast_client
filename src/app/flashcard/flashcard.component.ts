import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../services/quiz.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css'
})
export class FlashcardComponent {
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
  wasCorrect: boolean | null = null;

  actions:string='';
  id_user:number= 0;
  id_quiz:number= 0;

  constructor(private quizService: QuizService, @Inject(PLATFORM_ID) private platformId: Object, private route: ActivatedRoute,){}

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
      await this.quizService.generateFlashcard(this.selectedDocument, this.id_user).subscribe(data=>{
        this.questions = data.content.flashcards;
        if(this.questions){
          this.isLoading=true;
        }
        this.id_quiz = data.saved_quiz.Id_quiz
      })
    }

  startTimer() {
    this.timer = 15;
    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.nextQuestion();
      }
    }, 1000);
  }

  selectAnswer(isTrue: boolean) {
  if (!this.selectedOption) {
    const currentFlashcard = this.questions[this.currentIndex];
    this.selectedOption = isTrue;
    if (isTrue === currentFlashcard.isTrue) {
      this.score += 10;
      this.nextQuestion();
    }else{
      this.showExplanation = true;
    }
  }
}

  async nextQuestion() {
  this.selectedOption = null;
  this.showExplanation = false;

  if (this.currentIndex < this.questions.length - 1) {
    this.currentIndex++;
  } else {
    this.showResult = true;

    const body = { Id_user: this.id_user, Id_quiz: this.id_quiz, note: this.score };
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

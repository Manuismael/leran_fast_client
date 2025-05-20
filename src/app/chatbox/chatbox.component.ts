import { Component } from '@angular/core';
import { ResumboxService } from '../services/resumbox.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { QuizComponent } from '../quiz/quiz.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FlashcardComponent } from '../flashcard/flashcard.component';
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule,MarkdownModule,SidebarComponent, HeaderComponent, QuizComponent, FlashcardComponent, StatsComponent],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent {
  constructor(private fileUploadService: ResumboxService, private sanitizer: DomSanitizer, private router:Router, private route: ActivatedRoute) {}

  file: string = '';
  selectedFile: File | null = null;
  summaryText: SafeHtml ='';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  lastText: string = '';
  speech: string = '';
  activeSection: string = '';
  private utterance: SpeechSynthesisUtterance | null = null;

  historicText: SafeHtml ='';
  historics: any[] = [];


  filename: string = 'Choisissez un fichier';
  id_user:number= 0;

  ngOnInit() {
  this.id_user = +(this.route.snapshot.paramMap.get('id_user') || 'null');
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.filename = input.files[0].name;
    } else {
      this.filename = 'Choisissez un fichier';
    }
  }

  onSubmitFile(fileToResume:any): void{
    console.log(fileToResume.value);

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      this.selectedFile = file;
      this.errorMessage = null;
    } else {
      this.errorMessage = 'Only PDF or DOCX files are allowed';
      this.selectedFile = null;
    }
  }
  cleanText(text: string): string {
    // Supprimer Markdown (**gras**, *italique*)
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/\*(.*?)\*/g, '$1');

    // Supprimer les listes
    text = text.replace(/\* +/g, '');

    // Transformer les retours à la ligne en points
    text = text.replace(/\n+/g, '. ');

    // Nettoyer les espaces multiples
    text = text.replace(/\s+/g, ' ');

    // Remplacer les ":" par un point pour mieux respirer
    text = text.replace(/[:]/g, '.');

    return text.trim();
  }

  speak(text: string) {
    const cleanedText = this.cleanText(text);
    this.lastText = cleanedText;

    if (!('speechSynthesis' in window)) {
      console.log('speechSynthesis is not supported');
      return;
    }

    // Annuler toute lecture en cours
    window.speechSynthesis.cancel();

    // Attendre un peu avant de créer une nouvelle utterance
    setTimeout(() => {
      this.utterance = new SpeechSynthesisUtterance(cleanedText);
      this.utterance.lang = 'fr-FR';
      this.utterance.rate = 1;
      this.utterance.pitch = 1;

      // Démarrer la lecture
      window.speechSynthesis.speak(this.utterance);
    }, 100); // Pause de 100 millisecondes pour être sûr que cancel() est pris en compte
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  replaySpeech() {
    if (this.lastText) {
      this.speak(this.lastText);
    }
  }

  async onUpload() {
    if (!this.selectedFile) return;

    this.isLoading = true;
    try {
        const response = await this.fileUploadService.uploadFile(this.selectedFile, this.id_user).toPromise();
        const generateText = await marked(response.generate_summary.response.candidates[0].content.parts[0].text);
        this.summaryText = this.sanitizer.bypassSecurityTrustHtml(generateText) || 'No summary returned';
        this.speech = this.cleanText(response.generate_summary.response.candidates[0].content.parts[0].text);
        //reload
        this.fileUploadService.summaryHistory(this.id_user).subscribe(data => {
        this.historics = data;
        });
    } catch (error) {
        this.errorMessage = 'Failed to upload file. Please try again.';
    } finally {
        this.isLoading = false;
    }
  }

  GotoQuiz(){
    this.router.navigate(['/quiz'])
  }

  async onHistoricSelected(historic: any) {
    const HisText = await marked(historic.r_content);
    this.speech=historic.r_content;
    this.historicText = this.sanitizer.bypassSecurityTrustHtml(HisText)
  }

  onNewSummary(): void {
    this.historicText = '';
    this.summaryText = '';
  }


}

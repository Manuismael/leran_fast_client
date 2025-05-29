import { Component, ViewChild } from '@angular/core';
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

declare var responsiveVoice: any;
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
  histspeech: string = '';
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
    return text
    .replace(/[*•▪️◆►▶▪→-]/g, '')       // Supprimer les puces et symboles
    .replace(/[:]+/g, '.')              // Remplacer ":" par un point
    .replace(/\s{2,}/g, ' ')             // Supprimer les espaces multiples
    .replace(/\n+/g, '. ')               // Remplacer sauts de ligne par un point
    .replace(/#+/g, '')                  // Supprimer les titres markdown (## etc.)
    .replace(/\.(\s*\.)+/g, '.')         // Supprimer répétition de points
    .trim();
  }

  speak(text: string) {
  const cleanedText = this.cleanText(text);
  this.lastText = cleanedText;

  if (!('speechSynthesis' in window)) {
    console.log('speechSynthesis is not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel();

  // Découpage par phrase (finissant par . ! ? ou fin de ligne)
  const chunks = cleanedText.match(/[^\.!\?\n]+[\.!\?\n]+|.+$/g) || [];

  const speakChunk = (index: number) => {
    if (index >= chunks.length) return;

    const chunk = chunks[index].trim();
    if (chunk === '') {
      speakChunk(index + 1);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.1;
    utterance.pitch = 1;

    utterance.onend = () => {
      // Petite pause entre les phrases (très courte)
      setTimeout(() => speakChunk(index + 1), 50);
    };

    utterance.onerror = (e) => {
      console.error('Erreur de synthèse vocale :', e);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Démarrer
  setTimeout(() => speakChunk(0), 100);
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

  speakWithResponsiveVoice(text: string) {
     const cleanedText = this.cleanText(text);
    if (responsiveVoice && cleanedText) {
      responsiveVoice.cancel(); // au cas où une lecture est en cours
      responsiveVoice.speak(cleanedText, 'French Female', { rate: 1 });
    }
  }

  stopResponsiveVoice() {
    if (responsiveVoice) {
      responsiveVoice.cancel();
    }
  }


  @ViewChild(SidebarComponent) sidebarComponent!: SidebarComponent;
  async onUpload() {
    if (!this.selectedFile) return;

    this.isLoading = true;
    try {
        const response = await this.fileUploadService.uploadFile(this.selectedFile, this.id_user).toPromise();
        const generateText = await marked(response.generate_summary.response.candidates[0].content.parts[0].text);
        this.summaryText = this.sanitizer.bypassSecurityTrustHtml(generateText) || 'No summary returned';
        this.sidebarComponent.loadHistorics();
        this.speech = this.cleanText(response.generate_summary.response.candidates[0].content.parts[0].text);
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
    this.histspeech=historic.r_content;
    this.historicText = this.sanitizer.bypassSecurityTrustHtml(HisText)
  }

  onNewSummary(): void {
    this.historicText = '';
    this.summaryText = '';
  }


}

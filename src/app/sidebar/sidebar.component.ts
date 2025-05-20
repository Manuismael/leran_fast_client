import { Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';
import { ResumboxService } from '../services/resumbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private history:ResumboxService,  private router:Router, private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object){}

  id_user:number= 0;
  historics: any[] = [];

  ngOnInit(): void {
    this.id_user = +(this.route.snapshot.paramMap.get('id_user') || 'null');
    if (isPlatformBrowser(this.platformId)) {
      this.history.summaryHistory(this.id_user).subscribe(data => {
        this.historics = data;
      });
    }
  }

  @Output() historicSelected = new EventEmitter<any>();
  @Output() newSummary = new EventEmitter<void>();
  selectedHistoricId: string = '';

  selectHistoric(historic: any) {
    this.selectedHistoricId = historic.r_id_resum;
    this.historicSelected.emit(historic); // émet l'objet historique
  }

  createNewSummary() {
    this.selectedHistoricId = '';
    this.newSummary.emit();
  }

}

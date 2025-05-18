import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(private http: HttpClient) {}
  private apiUrl='http://localhost:3000/quiz';

  getQuiz(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getSavedDocument(id_user: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/file/saved_files/${id_user}`);
  }

  generateQuiz(id_docs:number, id_user:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getpath/${id_docs}/${id_user}`)
  }

  generateFlashcard(id_docs:number, id_user:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/flashcard/${id_docs}/${id_user}`)
  }

  noteQuiz(body:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/notequiz`, body)
  }

}

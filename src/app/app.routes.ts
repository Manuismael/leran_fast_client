import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { QuizComponent } from './quiz/quiz.component';

export const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'summary', component: ChatboxComponent},
  {path:'quiz', component:QuizComponent},
];

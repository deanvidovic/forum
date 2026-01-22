import { Component, signal } from '@angular/core';
import { Dialog } from './services/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  constructor(public dialog: Dialog) {}
}

import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Uvezi ChangeDetectorRef
import { Dialog } from './services/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  currentUser: any = null;
  showNavbar = signal(true);

  constructor(
    public dialog: Dialog, 
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      const isAuthPage = ['login', 'register'].some(path => url.includes(path));
      this.showNavbar.set(!isAuthPage);
    });
  }

  ngOnInit(): void {
    this.loadUser();

    window.addEventListener('userUpdated', () => {
      this.loadUser();
      this.cdr.detectChanges(); 
    });
  }

  loadUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    } else {
      this.currentUser = null;
    }
  }

  getInitial(): string {
    return this.currentUser?.username?.charAt(0).toUpperCase() || 'U';
  }

  onLogout() {
    this.dialog.show("Uspjesno ste se odjavili.", "Success");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']); 
  }
}
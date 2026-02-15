import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Dialog } from '../../services/dialog';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile-service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  isEditModalOpen: boolean = false;
  isEditThreadModalOpen: boolean = false;
  user: any = null;
  
  activeTab: 'my-threads' | 'liked-threads' = 'my-threads';
  myThreads: any[] = [];
  likedThreads: any[] = [];
  loadingThreads: boolean = false;
  
  editData = { username: '', email: '', bio: '' };
  editThreadData = { id: null, title: '', content: '' };

  constructor(
    private dialog: Dialog, 
    private router: Router, 
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.fetchContent();
  }


  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  onSaveProfile() {
    if (!this.user?.id) return;

    if (!this.editData.username.trim() || !this.editData.email.trim()) {
      this.dialog.show("Korisničko ime i e-mail su obavezni.", "Error");
      return;
    }

    if (!this.isValidEmail(this.editData.email)) {
      this.dialog.show("Molimo unesite ispravnu e-mail adresu.", "Error");
      return;
    }

    this.profileService.updateProfile(this.user.id, this.editData).subscribe({
      next: (res) => {
        this.user = { ...this.user, ...res.user };
        localStorage.setItem('user', JSON.stringify(this.user));
        window.dispatchEvent(new Event('userUpdated'));

        this.dialog.show("Profil je uspješno ažuriran!", "Success");
        this.toggleEditModal(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err.error?.message || "Greška pri ažuriranju.";
        this.dialog.show(msg, "Error");
        this.cdr.detectChanges();
      }
    });
  }


  onEditThread(event: Event, thread: any) {
    event.stopPropagation();
    this.editThreadData = { ...thread };
    this.isEditThreadModalOpen = true;
    this.cdr.detectChanges();
  }

  onSaveThreadEdit() {
    if (!this.editThreadData.id) return;
    if (!this.editThreadData.title.trim() || !this.editThreadData.content.trim()) {
      this.dialog.show("Naslov i sadržaj ne smiju biti prazni.", "Error");
      return;
    }

    const updatePayload = {
      title: this.editThreadData.title,
      content: this.editThreadData.content
    };

    this.profileService.updateThread(this.editThreadData.id, updatePayload).subscribe({
      next: () => {
        this.dialog.show("Objava uspješno ažurirana!", "Success");
        const index = this.myThreads.findIndex(t => t.id === this.editThreadData.id);
        if (index !== -1) {
          this.myThreads[index].title = this.editThreadData.title;
          this.myThreads[index].content = this.editThreadData.content;
        }
        this.isEditThreadModalOpen = false;
        this.cdr.detectChanges();
      },
      error: (err) => this.dialog.show("Greška pri spremanju.", "Error")
    });
  }

  onDeleteThread(event: Event, threadId: number) {
    event.stopPropagation();
    if (confirm('Jeste li sigurni da želite obrisati ovu objavu?')) {
      this.profileService.deleteThread(threadId).subscribe({
        next: () => {
          this.dialog.show("Objava obrisana.", "Success");
          this.myThreads = this.myThreads.filter(t => t.id !== threadId);
          this.cdr.detectChanges();
        },
        error: () => this.dialog.show("Greška pri brisanju.", "Error")
      });
    }
  }


  loadUserData() {
    const data = localStorage.getItem('user');
    if (data) {
      this.user = JSON.parse(data);
      this.syncEditData();
      this.cdr.detectChanges();
    }
  }

  setActiveTab(tab: 'my-threads' | 'liked-threads') {
    this.activeTab = tab;
    this.fetchContent();
    this.cdr.detectChanges();
  }

  fetchContent() {
    if (!this.user?.id) return;
    this.loadingThreads = true;
    this.cdr.detectChanges();

    const obs = this.activeTab === 'my-threads' 
      ? this.profileService.getUserThreads(this.user.id) 
      : this.profileService.getLikedThreads(this.user.id);

    obs.subscribe({
      next: (threads) => {
        if (this.activeTab === 'my-threads') this.myThreads = threads;
        else this.likedThreads = threads;
        this.loadingThreads = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loadingThreads = false; this.cdr.detectChanges(); }
    });
  }

  syncEditData() {
    this.editData = {
      username: this.user?.username || '',
      email: this.user?.email || '',
      bio: this.user?.bio || ''
    };
    this.cdr.detectChanges();
  }

  toggleEditModal(isOpen: boolean) {
    this.isEditModalOpen = isOpen;
    if (!isOpen) this.syncEditData(); 
    this.cdr.detectChanges();
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userUpdated'));
    this.router.navigate(['/login']); 
  }
}
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Threads } from '../../services/threads';
import { Dialog } from '../../services/dialog';

@Component({
  selector: 'app-thread-details',
  standalone: false,
  templateUrl: './thread-details.html',
  styleUrl: './thread-details.css',
})
export class ThreadDetails implements OnInit {
  thread: any = null;
  loading: boolean = true;
  commentContent: string = '';
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private threadService: Threads,
    private dialog: Dialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUserId = JSON.parse(userData).id;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadThreadData(Number(id));
    }
  }

  loadThreadData(id: number) {
    this.loading = true;
    this.threadService.getThreadById(id).subscribe({
      next: (data) => {
        this.thread = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.dialog.show("Thread nije pronađen.", "Error");
        this.router.navigate(['/home']);
      }
    });
  }

  onLike() {
    if (!this.currentUserId) {
      this.dialog.show("Moraš biti prijavljen za lajkanje.", 'Warning');
      return;
    }

    this.threadService.toggleLike(this.thread.id).subscribe({
      next: (res) => {
        this.thread.isLiked = res.liked;
        if (res.liked) {
          this.thread.likes_count = Number(this.thread.likes_count || 0) + 1;
        } else {
          this.thread.likes_count = Math.max(0, Number(this.thread.likes_count || 0) - 1);
        }
        this.cdr.detectChanges();
      },
      error: () => this.dialog.show("Greška pri lajkanju.", 'Error')
    });
  }

  submitComment() {
    if (!this.commentContent.trim()) return;

    const payload = {
      content: this.commentContent,
      threadId: this.thread.id
    };

    this.threadService.addComment(payload).subscribe({
      next: () => {
        this.commentContent = '';
        this.loadThreadData(this.thread.id);
      },
      error: () => this.dialog.show("Greška pri slanju komentara.", "Error")
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
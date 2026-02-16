import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../services/category';
import { Threads } from '../../services/threads';
import { Dialog } from '../../services/dialog';
import { ProfileService } from '../../services/profile-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  categories: any[] = [];
  allThreads: any[] = [];
  filteredThreads: any[] = [];
  loading: boolean = true;
  categoriesSelectionDropdownOpen: boolean = false;
  selectedCategoryName: string = 'Odaberi Kategoriju';
  user: any = null;
  currentUserId: number | null = null;
  isEditMode: boolean = false;
  editingThreadId: number | null = null;

  adminForm: FormGroup;
  isAdminModalOpen: boolean = false;

  newThread = {
    title: '',
    content: '',
    categoryId: null as number | null
  };

  constructor(
    private fb: FormBuilder,
    private categoryService: Category,
    private threadService: Threads,
    private profileService: ProfileService,
    private dialog: Dialog,
    private cdr: ChangeDetectorRef
  ) {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['user', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.currentUserId = this.user.id;
    }
    this.loadData();
  }

  toggleAdminModal(open: boolean) {
    this.isAdminModalOpen = open;
    if (!open) {
      this.adminForm.reset({ role: 'user' });
    }
  }

  onAdminCreateUser() {
    if (this.adminForm.valid) {
      this.profileService.adminAddUser(this.adminForm.value).subscribe({
        next: (res) => {
          this.dialog.show(`Korisnik ${res.user?.username || 'novi član'} uspješno kreiran!`, 'Success');
          this.toggleAdminModal(false);
        },
        error: (err) => {
          const msg = err.error?.message || "Greška pri kreiranju korisnika.";
          this.dialog.show(msg, 'Error');
          console.log(err);
        }
      });
    } else {
      const controls = this.adminForm.controls;
      if (controls['username'].errors?.['minlength']) {
        this.dialog.show("Username mora imati barem 3 znaka.", 'Warning');
      } else if (controls['email'].errors?.['email']) {
        this.dialog.show("Unesite ispravnu email adresu.", 'Warning');
      } else if (controls['password'].errors?.['minlength']) {
        this.dialog.show("Lozinka mora imati barem 8 znakova.", 'Warning');
      } else {
        this.dialog.show("Molimo ispravno popunite sva polja.", 'Warning');
      }
    }
  }


  loadData() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Greška - kategorije:', err)
    });

    this.threadService.getThreads().subscribe({
      next: (data) => {
        this.allThreads = data;
        this.filteredThreads = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Greška - threadovi:', err);
        this.loading = false;
      }
    });
  }

  onLikeThread(event: Event, thread: any) {
    event.stopPropagation();
    if (!this.currentUserId) {
      this.dialog.show("Moraš biti prijavljen da bi lajkao objave.", 'Warning');
      return;
    }
    this.threadService.toggleLike(thread.id).subscribe({
      next: (res) => {
        thread.isLiked = res.liked;
        if (res.liked) {
          thread.likes_count = Number(thread.likes_count || 0) + 1;
        } else {
          thread.likes_count = Math.max(0, Number(thread.likes_count || 0) - 1);
        }
        this.cdr.detectChanges();
      },
      error: (err) => this.dialog.show("Greška pri lajkanju.", 'Error')
    });
  }

  onSubmitThread() {
    if (!this.newThread.title || !this.newThread.content || !this.newThread.categoryId) {
      this.dialog.show("Molimo popunite sva polja i odaberite kategoriju.", 'Warning')
      return;
    }
    if (this.isEditMode && this.editingThreadId) {
      this.threadService.updateThread(this.editingThreadId, this.newThread).subscribe({
        next: () => {
          this.dialog.show('Objava uspješno ažurirana!', 'Success');
          this.resetForm();
          this.loadData();
        },
        error: (err) => this.dialog.show("Greška pri ažuriranju.", 'Error')
      });
    } else {
      this.threadService.createThread(this.newThread).subscribe({
        next: () => {
          this.dialog.show('Uspješno dodan thread!', 'Success');
          this.resetForm();
          this.loadData();
        },
        error: (err) => this.dialog.show("Greška pri objavi.", 'Error')
      });
    }
  }

  startEdit(thread: any, event: Event) {
    event.stopPropagation();
    this.isEditMode = true;
    this.editingThreadId = thread.id;
    this.newThread = {
      title: thread.title,
      content: thread.content,
      categoryId: thread.category_id
    };
    const cat = this.categories.find(c => c.id === thread.category_id);
    this.selectedCategoryName = cat ? cat.name : 'Odaberi Kategoriju';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDeleteThread(event: Event, threadId: number) {
    event.stopPropagation();
    const confirmMsg = this.user?.role === 'admin'
      ? 'ADMIN: Jeste li sigurni da želite trajno ukloniti ovu objavu?'
      : 'Jesi li siguran da želiš obrisati svoju objavu?';
    if (confirm(confirmMsg)) {
      this.threadService.deleteThread(threadId).subscribe({
        next: () => {
          this.dialog.show('Objava obrisana!', 'Success');
          this.loadData();
        },
        error: (err) => this.dialog.show('Greška pri brisanju.', 'Error')
      });
    }
  }

  filterByCategory(categoryId: number | null) {
    if (categoryId === null) {
      this.filteredThreads = this.allThreads;
    } else {
      this.filteredThreads = this.allThreads.filter(t => t.category_id === categoryId);
    }
  }

  selectCategory(cat: any) {
    this.selectedCategoryName = cat.name;
    this.newThread.categoryId = cat.id;
    this.categoriesSelectionDropdownOpen = false;
  }

  toggleDropdown() {
    this.categoriesSelectionDropdownOpen = !this.categoriesSelectionDropdownOpen;
  }

  cancelEdit() { this.resetForm(); }

  private resetForm() {
    this.isEditMode = false;
    this.editingThreadId = null;
    this.newThread = { title: '', content: '', categoryId: null };
    this.selectedCategoryName = 'Odaberi Kategoriju';
  }
}

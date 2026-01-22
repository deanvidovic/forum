import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Dialog } from '../../services/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  loginForm: FormGroup;
  hidePassword:Boolean = true;

  constructor(private fb: FormBuilder, private authService: Auth, private dialog: Dialog, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res.message);
          this.dialog.show(res.message, 'Success');
          this.router.navigate(['/home']);
        },

        error: (err) => {
          const msg = err.error.message || 'Server is currently unreachable. Please try again later';
          this.dialog.show(msg, 'Error');
        }
      })
    };
  }
}

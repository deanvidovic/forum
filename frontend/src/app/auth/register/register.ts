import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { Dialog } from '../../services/dialog';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  hidePassword:Boolean = true;
  hideRePassword:Boolean = true;

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const repassword = control.get('repassword');

    if (password && repassword && password.value !== repassword.value) {
      repassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router, private dialog: Dialog) {
    this.registerForm = fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    })
  }

  onSubmit() {
    if (this.registerForm.valid) {
      
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res.message);
          this.dialog.show(res.message, 'Success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const msg = err.error.message;

          if (err.error.details && err.error.details.length > 0) {
            const fullMessage = `${msg}: ${err.error.details.join(' ')}`;
            this.dialog.show(fullMessage, 'Error');
          } else {
            this.dialog.show(msg, 'Error');
          }``
        }
      })

    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}

import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';


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

  constructor(private fb: FormBuilder) {
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
      console.log('Slanje na backend:', this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}

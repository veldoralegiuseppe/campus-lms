import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import { AuthService } from '../../commons/authentication/auth.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {}

  onSubmit(): void {
    console.log('Submit!')
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      const username = this.emailFormControl.value;
      const password = this.passwordFormControl.value;

      //  // Call the authentication service's login method
      //  if (this.authService.login(username, password)) {
      //   // Navigate to the ProductListComponent upon successful login
      //   this.router.navigate(['/product-list']);
      // } else {
      //   // Handle authentication error (show error message, etc.)
      // }

      // Call the authentication service's login method
      this.auth.fakeLogin()
      
      // Navigate to the dashboard
      this.router.navigate(['/dashboard']);

    }
  }

}

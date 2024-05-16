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
  private previousUrl: String | undefined

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    //this.previousUrl = router.getCurrentNavigation()?.extras?.state?.['previousUrl'];
    //console.log(`Login component - previousUrl: ${this.previousUrl}`)
  }

  onSubmit(): void {
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      
      const email = this.emailFormControl.value!;
      const password = this.passwordFormControl.value!;

      this.auth.login(email, password).subscribe(value => {
        if(value){
          if(this.previousUrl) this.router.navigateByUrl(this.previousUrl.toString())
          else this.router.navigate(['/dashboard'])
        } 
        // else gestire credenziali errate
      })
     
      //this.auth.fakeLogin(email, password)
      
    }
  }

}

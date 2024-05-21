import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/main-container/login/login.component';
import { UserService, UtenteRequest } from '../user.service';
import { HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAdminComponent implements OnInit{

   /**
   * Utente form
   */
   utenteForm!: FormGroup

   /**
   * Utente form
   */
   corsoForm!: FormGroup

   /**
    * Matcher
    */
   matcher = new MyErrorStateMatcher();

  /** 
   * Corsi
   */
   corsi: Corsi[] = [];

   /** 
   * Corsi cattedra libera
   */
   corsiCattedraLibera: Corsi[] = [];

   /** 
    * Progress
    */
   progress: number | null = null

   constructor(private _userService: UserService, private _changeDetector: ChangeDetectorRef, private _snackBar: MatSnackBar){}

  ngOnInit(): void {
    // Inizializzazione corsi 
    this._userService.getCorsi().then(c => {
      this.corsi = c!.map(v => { return {value: v.nome, viewValue: v.nome}})
    })

    this._userService.getCorsiCattedraLibera().then(c => {
      this.corsiCattedraLibera = c!.map(v => { return {value: v.nome, viewValue: v.nome}})
    })

    // Inizializzazione form
    this.utenteForm = new FormGroup({
      'nome': new FormControl(null, [Validators.required]),
      'cognome': new FormControl(null, [Validators.required]),
      'codiceFiscale': new FormControl(null, [Validators.required, Validators.pattern('^[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}$')]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'ruolo': new FormControl(null, [Validators.required]),
    })

    this.utenteForm.get('ruolo')?.valueChanges.subscribe(() => {this._changeDetector.detectChanges()})

    this.corsoForm = new FormGroup({
      "corsi": new FormControl(null),
    })
  }

  onSubmit() {
    
    const utenteRequest: UtenteRequest = {
      nome: this.utenteForm.get('nome')?.value,
      cognome: this.utenteForm.get('cognome')?.value,
      codiceFiscale: this.utenteForm.get('codiceFiscale')?.value,
      ruolo: this.utenteForm.get('ruolo')?.value,
      email: this.utenteForm.get('email')?.value,
      password: null,
      corsi: this.corsoForm.get('corsi')?.value,
    }

    console.log(utenteRequest)

    this._userService.create(utenteRequest).subscribe(
      (event) => {
        if (event.type == HttpEventType.UploadProgress){ 
          this.progress = Math.round(100 * (event.loaded / event.total!));
          this._changeDetector.detectChanges()
        }
      },

      (error) => {
        this.progress = null
        this.openSnackBar(error, "Chiudi")
        this._changeDetector.detectChanges()
      },

      () => {
        this.progress = null
        this.utenteForm.reset()
        this.corsoForm.reset()
        this.openSnackBar("Utente creato con successo", "Chiudi")
        this._changeDetector.detectChanges()
      }

    )

  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}

interface Corsi {
  value: string;
  viewValue: string;
}

import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, IAuthInfo} from 'src/app/commons/authentication/auth.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuthenticationComponent implements AfterViewChecked, OnDestroy {

  protected isAuthenticated = false
  protected authInfo: IAuthInfo | null = null
  private authSub: Subscription | null = null
  protected auth = inject(AuthService)
  private changeDetector = inject(ChangeDetectorRef)


  constructor(){
    this.authSub = this.auth.stateItem$.subscribe(auth =>  {
      this.isAuthenticated = !(auth == null)
      this.authInfo = auth
    })
  }
  ngAfterViewChecked(): void {
    this.auth.stateItem$.subscribe(auth => {
      this.changeDetector.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe()
  }

}

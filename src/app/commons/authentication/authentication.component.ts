import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, IAuthInfo} from 'src/app/commons/authentication/auth.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent implements OnDestroy {

  protected isAuthenticated = false
  protected authInfo: IAuthInfo | null = null
  private authSub: Subscription | null = null
  protected auth = inject(AuthService)


  constructor(){
    this.authSub = this.auth.stateItem$.subscribe(auth =>  {
      this.isAuthenticated = !(auth == null)
      this.authInfo = auth
    })
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe()
  }

}

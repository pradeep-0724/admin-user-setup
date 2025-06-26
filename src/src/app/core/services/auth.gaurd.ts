import { AuthService } from '../../modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { Injectable } from '@angular/core';
import { pairwise, filter,} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthGaurd implements CanActivate {
  returnUrl: string;

  constructor(private router: Router, private auth: AuthService,
    ) {
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.returnUrl = events[1].urlAfterRedirects;
      });
  }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if (this.auth.isLoggedIn()) {
    return true
    } else {
      this.router.navigate(['login'], { queryParams: { returnUrl: this.returnUrl } });
    }
  }

}

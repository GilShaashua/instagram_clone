import { ActivatedRouteSnapshot } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { inject } from '@angular/core'

export function userResolver(route: ActivatedRouteSnapshot) {
    const userId = route.params['userId']

    return inject(AuthService).getUserById(userId)
}

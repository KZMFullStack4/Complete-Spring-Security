import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';

import {ITEMS_PER_PAGE, UserRouteAccessService} from '../../shared';
import {JhiPaginationUtil} from 'ng-jhipster';

import {MainAuthorityComponent} from './main-authority.component';
import {MainAuthorityPopupComponent} from './main-authority-dialog.component';
import {MainAuthorityDeletePopupComponent} from './main-authority-delete-dialog.component';

@Injectable({ providedIn: 'root' })
export class MainAuthorityResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const size = route.queryParams['size'] ? route.queryParams['size'] : ITEMS_PER_PAGE;
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'name,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            size: this.paginationUtil.parsePage(size),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const mainAuthorityRoute: Routes = [
    {
        path: '',
        component: MainAuthorityComponent,
        resolve: {
            'pagingParams': MainAuthorityResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'niopdcgatewayApp.mainAuthority.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const mainAuthorityPopupRoute: Routes = [
    {
        path: 'new/:parentAuthorityId',
        component: MainAuthorityPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'niopdcgatewayApp.mainAuthority.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: ':id/edit',
        component: MainAuthorityPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'niopdcgatewayApp.mainAuthority.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: ':id/delete',
        component: MainAuthorityDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'niopdcgatewayApp.mainAuthority.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: ':id/:view',
        component: MainAuthorityPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'niopdcgatewayApp.mainAuthority.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];

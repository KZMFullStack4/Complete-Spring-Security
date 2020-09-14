import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';

import {ITEMS_PER_PAGE, UserRouteAccessService} from '../../shared';
import {JhiPaginationUtil} from 'ng-jhipster';

import {ActionLogMappingComponent} from './action-log-mapping.component';
import {ActionLogMappingPopupComponent} from './action-log-mapping-dialog.component';
import {ActionLogMappingDeletePopupComponent} from './action-log-mapping-delete-dialog.component';

@Injectable({providedIn: 'root'})
export class ActionLogMappingResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const size = route.queryParams['size'] ? route.queryParams['size'] : ITEMS_PER_PAGE;
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,desc';
        return {
            page: this.paginationUtil.parsePage(page),
            size: this.paginationUtil.parsePage(size),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const actionLogMappingRoute: Routes = [
    {
        path: '',
        component: ActionLogMappingComponent,
        resolve: {
            'pagingParams': ActionLogMappingResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'niopdcgatewayApp.actionLogMapping.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const actionLogMappingPopupRoute: Routes = [
    {
        path: ':id/edit',
        component: ActionLogMappingPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'niopdcgatewayApp.actionLogMapping.home.mapping'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }, {
        path: ':id/delete',
        component: ActionLogMappingDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'niopdcgatewayApp.actionLogMapping.home.mapping'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
];

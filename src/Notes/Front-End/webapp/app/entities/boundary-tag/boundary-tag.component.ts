import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import {BoundaryTag} from './boundary-tag.model';
import {BoundaryTagService} from './boundary-tag.service';
import {ITEMS_PER_PAGE, Principal} from '../../shared';
import {Location, LocationService} from '../location/.';
import {LazyLoadEvent} from 'primeng/primeng';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'jhi-boundary-tag',
    templateUrl: './boundary-tag.component.html'
})
export class BoundaryTagComponent implements OnInit, OnDestroy {

    currentAccount: any;
    boundaryTags: BoundaryTag[];
    boundaryTag: BoundaryTag = new BoundaryTag();
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    locationId: number;
    location: Location;
    breadcrumbItems: any[];

    constructor(
        private boundaryTagService: BoundaryTagService,
        private locationService: LocationService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private translateService: TranslateService,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
        this.currentSearch = activatedRoute.snapshot.queryParams['search'] ? activatedRoute.snapshot.queryParams['search'] : '';
        this.locationId = activatedRoute.snapshot.params['locationId'];

        const x = this.currentSearch.split('&');
        for (const key of x) {
            let value = key.split('$');
            if (key.lastIndexOf('#') >= 0) { // enum
                value = key.split('#');
            } else if (key.lastIndexOf(';') >= 0) { // Boolean
                value = key.split(';');
            } else if (key.lastIndexOf('☼') >= 0) { // equal number
                value = key.split('☼');
            } else if (key.lastIndexOf('>') >= 0) { // number
                value = key.split('>');
            } else if (key.lastIndexOf('<') >= 0) { // number
                value = key.split('<');
            } else if (key.lastIndexOf('→') >= 0) { // start date
                value = key.split('→');
            } else if (key.lastIndexOf('←') >= 0) { // end date
                value = key.split('←');
            }

            if (value.length > 1) {
                this.boundaryTag[value[0]] = value[1];
            }
        }
    }

    loadAll() {
        this.boundaryTagService.query(this.locationId, {
            query: this.currentSearch.length > 0 ? this.currentSearch : null,
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: HttpResponse<BoundaryTag[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';

        this.router.navigate(['location/' + this.locationId + '/boundary-tag', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.boundaryTag = new BoundaryTag();
        this.loadAll();
    }

    search() {
        this.page = 0;
        this.currentSearch = '';
        if (this.boundaryTag.amount) {
            this.currentSearch += 'amount☼' + this.boundaryTag.amount + '&';
        }
        if (this.boundaryTag.buyPrice) {
            this.currentSearch += 'buyPrice☼' + this.boundaryTag.buyPrice + '&';
        }
        if (this.boundaryTag.buyDate) {
            this.currentSearch += 'buyDate→' + this.boundaryTag.buyDate.toISOString() + '&';
        }
        if (this.currentSearch.length > 0) {
            this.currentSearch = this.currentSearch.substring(0, this.currentSearch.length - 1);
        }

        this.router.navigate(['location/' + this.locationId + '/boundary-tag', {
            search: this.currentSearch,
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }

    setBreadCrumb() {
        this.breadcrumbItems = [];
        this.translateService.get('global.menu.home').subscribe(title => {
            this.breadcrumbItems.push({label: title, routerLink: ['/']});
        });
        this.translateService.get('niopdcgatewayApp.boundaryTag.home.locationTitle').subscribe(title => {
            this.breadcrumbItems.push({
                label: title + ` (${this.location.name})`,
                routerLink: ['/location/' + this.location.locationId + '/sub-locations']
            });
        });
        this.translateService.get('niopdcgatewayApp.boundaryTag.home.title').subscribe(title => {
            this.breadcrumbItems.push({label: title});
        });
    }

    ngOnInit() {
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });

        this.registerChangeInBoundaryTags();

        this.locationService.find(this.locationId).subscribe(
            (location: HttpResponse<Location>) => {
                this.location = location.body;
                this.setBreadCrumb();
            }
        );
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: BoundaryTag) {
        return item.id;
    }

    registerChangeInBoundaryTags() {
        this.eventSubscriber = this.eventManager.subscribe('boundaryTagListModification',response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.boundaryTags = data;
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    loadLazy(event: LazyLoadEvent) {
        const predicate = this.predicate;
        const reverse = this.reverse;
        const page = this.page;
        const itemsPerPage = this.itemsPerPage;
        this.page = (event.first / event.rows) + 1;
        this.itemsPerPage = event.rows;
        if (event.sortField) {
            this.predicate = event.sortField;
            this.reverse = event.sortOrder === 1;
        }

        if (this.page > 1 ||
            this.page !== page ||
            this.itemsPerPage !== itemsPerPage ||
            this.predicate !== predicate ||
            this.reverse !== reverse) {

            this.router.navigate(['location', this.locationId, 'boundary-tag'], {
                queryParams: {
                    page: this.page,
                    size: this.itemsPerPage,
                    search: this.currentSearch,
                    sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
                }
            });
        }

        this.loadAll();
    }

}

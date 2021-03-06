import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import {BuyType} from './buy-type.model';
import {BuyTypeService} from './buy-type.service';
import {Principal} from '../../shared';

import {LazyLoadEvent} from 'primeng/primeng';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'jhi-buy-type',
    templateUrl: './buy-type.component.html'
})
export class BuyTypeComponent implements OnInit, OnDestroy {

    currentAccount: any;
    buyTypes: BuyType[];
    buyType: BuyType = new BuyType();
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
    breadcrumbItems: any[];

    constructor(
        private buyTypeService: BuyTypeService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private translateService: TranslateService,
        private eventManager: JhiEventManager
    ) {
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.itemsPerPage = data.pagingParams.size;
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = !data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
        console.log('ssssssssssssssssssss:', this.itemsPerPage);
        this.currentSearch = activatedRoute.snapshot.queryParams['search'] ? activatedRoute.snapshot.queryParams['search'] : '';
        this.buyType.sellLimit = null;

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
                if (value[0] === 'sellLimit') {
                    this.buyType[value[0]] = Boolean(value[1]);
                } else {
                    this.buyType[value[0]] = value[1];
                }
            }
        }
    }

    loadAll() {
        this.buyTypeService.query({
            query: this.currentSearch.length > 0 ? this.currentSearch : null,
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: HttpResponse<BuyType[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate(['/buy-type'], {
            queryParams: {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        });
        this.buyType = new BuyType();
        this.buyType.sellLimit = null;
        this.loadAll();
    }

    search() {
        this.page = 0;
        this.currentSearch = '';
        if (this.buyType.title) {
            this.currentSearch += 'title$' + this.buyType.title + '&';
        }
        if (this.buyType.buyGroup) {
            this.currentSearch += 'buyGroup#BuyGroup.' + this.buyType.buyGroup + '&';
        }
        if (this.buyType.effectDate) {
            this.currentSearch += 'effectDate☼' + this.buyType.effectDate + '&';
        }
        if (this.buyType.buyTypeUsage) {
            this.currentSearch += 'buyTypeUsage#BuyTypeUsage.' + this.buyType.buyTypeUsage + '&';
        }
        if (this.buyType.typeEffect) {
            this.currentSearch += 'typeEffect#TypeEffect.' + this.buyType.typeEffect + '&';
        }
        if (this.buyType.sellLimit) {
            this.currentSearch += 'sellLimit;' + this.buyType.sellLimit + '&';
        }
        if (this.currentSearch.length > 0) {
            this.currentSearch = this.currentSearch.substring(0, this.currentSearch.length - 1);
        }

        this.router.navigate(['/buy-type'], {
            queryParams: {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        });
        this.loadAll();
    }

    setBreadCrumb() {
        this.breadcrumbItems = [];
        this.translateService.get('global.menu.home').subscribe(title => {
            this.breadcrumbItems.push({label: title, routerLink: ['/']});
        });
        this.translateService.get('niopdcgatewayApp.buyType.home.title').subscribe(title => {
            this.breadcrumbItems.push({label: title});
        });
    }

    ngOnInit() {
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });

        this.registerChangeInBuyTypes();

        this.setBreadCrumb();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: BuyType) {
        return item.id;
    }

    registerChangeInBuyTypes() {
        this.eventSubscriber = this.eventManager.subscribe('buyTypeListModification',response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'desc' : 'asc')];

        return result;
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
            this.reverse = event.sortOrder !== 1;
        }

        if (this.page > 1 ||
            this.page !== page ||
            this.itemsPerPage !== itemsPerPage ||
            this.predicate !== predicate ||
            this.reverse !== reverse) {

            this.router.navigate(['/buy-type'], {
                queryParams: {
                    page: this.page,
                    size: this.itemsPerPage,
                    search: this.currentSearch,
                    sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
                }
            });
        }

        this.loadAll();
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.buyTypes = data;
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

}

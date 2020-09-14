import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import {CurrencyRate} from './currency-rate.model';
import {CurrencyRateService} from './currency-rate.service';
import {Principal} from '../../shared';
import {Currency, CurrencyService} from '../currency/.';
import {LazyLoadEvent} from 'primeng/primeng';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'jhi-currency-rate',
    templateUrl: './currency-rate.component.html'
})
export class CurrencyRateComponent implements OnInit, OnDestroy {

    currentAccount: any;
    currencyRates: CurrencyRate[];
    currencyRate: CurrencyRate = new CurrencyRate();
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
    currencyId: number;
    currency: Currency;
    breadcrumbItems: any[];

    constructor(
        private currencyRateService: CurrencyRateService,
        private currencyService: CurrencyService,
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
        this.currentSearch = activatedRoute.snapshot.queryParams['search'] ? activatedRoute.snapshot.queryParams['search'] : '';
        this.currencyId = activatedRoute.snapshot.params['currencyId'];

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
                this.currencyRate[value[0]] = value[1];
            }
        }
    }

    loadAll() {
        this.currencyRateService.query(this.currencyId, {
            query: this.currentSearch.length > 0 ? this.currentSearch : null,
            page: this.page,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: HttpResponse<CurrencyRate[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';

        this.router.navigate(['currency/' + this.currencyId + '/currency-rate'], {
            queryParams: {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        });
        this.currencyRate = new CurrencyRate();
        this.currencyRate.activeStartDate = null;
        this.currencyRate.activeFinishDate = null;
        this.loadAll();
    }

    search() {
        this.page = 0;
        this.currentSearch = '';
        if (this.currencyRate.rate) {
            this.currentSearch += 'rate☼' + this.currencyRate.rate + '&';
        }
        if (this.currencyRate.activeStartDate) {
            this.currentSearch += 'activeStartDate→' + this.currencyRate.activeStartDate.toISOString() + '&';
        }
        if (this.currencyRate.activeFinishDate) {
            this.currentSearch += 'activeFinishDate→' + this.currencyRate.activeFinishDate.toISOString() + '&';
        }
        if (this.currentSearch.length > 0) {
            this.currentSearch = this.currentSearch.substring(0, this.currentSearch.length - 1);
        }

        this.router.navigate(['currency/' + this.currencyId + '/currency-rate'], {
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
        this.translateService.get('niopdcgatewayApp.currencyRate.home.currencyTitle').subscribe(title => {
            this.breadcrumbItems.push({label: title + ` (${this.currency.title})`, routerLink: ['/currency']});
        });
        this.translateService.get('niopdcgatewayApp.currencyRate.home.title').subscribe(title => {
            this.breadcrumbItems.push({label: title});
        });
    }

    ngOnInit() {
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });

        this.registerChangeInCurrencyRates();

        this.currencyService.find(this.currencyId).subscribe(
            (currency: HttpResponse<Currency>) => {
                this.currency = currency.body;
                this.setBreadCrumb();
            }
        );
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CurrencyRate) {
        return item.id;
    }

    registerChangeInCurrencyRates() {
        this.eventSubscriber = this.eventManager.subscribe('currencyRateListModification',response => this.loadAll());
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

            this.router.navigate(['currency', this.currencyId, 'currency-rate'], {
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
        this.currencyRates = data;
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

}

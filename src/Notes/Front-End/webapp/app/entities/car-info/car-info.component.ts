
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { CarInfo } from './car-info.model';
import { CarInfoService } from './car-info.service';
import { Principal } from '../../shared';
import { Car, CarService } from '../car/.';
import { LazyLoadEvent } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

@Component({
    selector: 'jhi-car-info',
    templateUrl: './car-info.component.html'
})
export class CarInfoComponent implements OnInit, OnDestroy {

    currentAccount: any;
    carInfos: CarInfo[];
    carInfo: CarInfo = new CarInfo();
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
    carId: number;
    car: Car;
    breadcrumbItems: any[];

    constructor(
        private carInfoService: CarInfoService,
                 private carService: CarService,
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
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = !data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.queryParams['search'] ? activatedRoute.snapshot.queryParams['search'] : '';
        this.carId = activatedRoute.snapshot.params['carId'];

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
            this.carInfo[value[0]] = value[1];
            }
        }
    }

    loadAll() {
        this.carInfoService.query(this.carId, {
            query: this.currentSearch.length > 0 ? this.currentSearch : null,
            page: this.page,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
            (res: HttpResponse<CarInfo[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';

        this.router.navigate(['car/' + this.carId + '/car-info'], {
            queryParams: {  page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        });
        this.loadAll();
    }

    search() {
        this.page = 0;
        this.currentSearch = '';
        if (this.carInfo.physicalInsuranceNo) {
            this.currentSearch += 'physicalInsuranceNo$' + this.carInfo.physicalInsuranceNo + '&';
        }
        if (this.carInfo.thirdPartyInsuranceNo) {
            this.currentSearch += 'thirdPartyInsuranceNo$' + this.carInfo.thirdPartyInsuranceNo + '&';
        }
        if (this.carInfo.wayBillCardSerial) {
            this.currentSearch += 'wayBillCardSerial$' + this.carInfo.wayBillCardSerial + '&';
        }
        if (this.currentSearch.length > 0) {
            this.currentSearch = this.currentSearch.substring(0, this.currentSearch.length - 1);
        }

        this.router.navigate(['car/' + this.carId + '/car-info'], {
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
        this.translateService.get('niopdcgatewayApp.carInfo.home.carTitle').subscribe(title => {
            this.breadcrumbItems.push({label: title + ` (${this.car.title})`, routerLink: ['/car']});
        });
        this.translateService.get('niopdcgatewayApp.carInfo.home.title').subscribe(title => {
            this.breadcrumbItems.push({label: title});
        });
    }

    ngOnInit() {
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });

        this.registerChangeInCarInfos();

        this.carService.find(this.carId).subscribe(car => {
                this.car = car.body;
                this.setBreadCrumb();
            }
        );
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CarInfo) {
        return item.id;
    }

    registerChangeInCarInfos() {
        this.eventSubscriber = this.eventManager.subscribe('carInfoListModification',response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'desc' : 'asc')];
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
            this.totalItems = headers.get('X-Total-Count');
            this.queryCount = this.totalItems;
            // this.page = pagingParams.page;
        this.carInfos = data;
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
            this.reverse = event.sortOrder !== 1;
        }

        if (this.page > 1 ||
            this.page !== page ||
            this.itemsPerPage !== itemsPerPage ||
            this.predicate !== predicate ||
            this.reverse !== reverse) {

            this.router.navigate(['car' , this.carId , 'car-info'], {
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

}

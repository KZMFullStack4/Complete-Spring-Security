import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import {VehicleModel, VehicleModelType} from './vehicle-model.model';
import {VehicleModelService} from './vehicle-model.service';
import {ITEMS_PER_PAGE, Principal} from '../../shared';

import {LazyLoadEvent} from 'primeng/primeng';
import {TranslateService} from '@ngx-translate/core';
import {log} from 'util';

@Component({
    selector: 'jhi-vehicle-model',
    templateUrl: './vehicle-model.component.html'
})
export class VehicleModelComponent implements OnInit, OnDestroy {

    currentAccount: any;
    vehicleModels: VehicleModel[];
    vehicleModel: VehicleModel = new VehicleModel();
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
    VehicleModelType = VehicleModelType;

    constructor(
        private vehicleModelService: VehicleModelService,
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
            this.reverse = !data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
        this.currentSearch = activatedRoute.snapshot.queryParams['search'] ? activatedRoute.snapshot.queryParams['search'] : '';

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
                if (value[0].indexOf('.') > 0) {
                    const z = value[0].split('.');
                    value[0] = z[0] + z[1].substring(0, 1).toUpperCase() + z[1].substring(1);
                    this.vehicleModel[value[0]] = Number(value[1]);
                }
            }
        }
    }

    loadAll() {
        this.vehicleModelService.query({
            title: this.vehicleModel.title,
            vehicleModelType: this.vehicleModel.vehicleModelType,
            customerGroup: this.vehicleModel.customerGroup,
            productTitle: this.vehicleModel.productTitle,
            type: this.vehicleModel.customerType,
            capacity: this.vehicleModel.capacity,
            confirm: this.vehicleModel.confirm === false ? 'false' : this.vehicleModel.confirm ? 'true' : null,
            product: this.vehicleModel.productTitle,
            query: this.currentSearch.length > 0 ? this.currentSearch : null,
            page: this.page,
            size: this.itemsPerPage,
            sort: this.sort()

        }).subscribe(
            (res: HttpResponse<VehicleModel[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate(['/vehicle-model'], {
            queryParams: {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        });
        this.vehicleModel = new VehicleModel();
        this.loadAll();
    }

    search() {
        this.page = 0;
        this.currentSearch = '';
        if (this.vehicleModel.title) {
            this.currentSearch += 'vehicleModel#title$' + this.vehicleModel.title + '&';
        }
        if (this.vehicleModel.capacity) {
            this.currentSearch += 'vehicleModel#capacity$' + this.vehicleModel.capacity + '&';
        }
        if (this.vehicleModel.customerGroup) {
            this.currentSearch += 'customerGroup#CustomerGroup.' + this.vehicleModel.customerGroup + '&';
        }
        if (this.vehicleModel.vehicleModelType) {
            this.currentSearch += 'vehicleModelType#VehicleModelType.' + this.vehicleModel.vehicleModelType + '&';
        }
        if (this.vehicleModel.productTitle) {
            this.currentSearch += 'vehicleCapacity#product#title$' + this.vehicleModel.productTitle + '&';
        }
        if (this.vehicleModel.confirm !== null) {
            this.currentSearch += 'confirm;' + this.vehicleModel.confirm + '&';
        }
        if (this.currentSearch.length > 0) {
            this.currentSearch = this.currentSearch.substring(0, this.currentSearch.length - 1);
        }

        localStorage.setItem('vehicle-model-search', this.currentSearch);
        this.router.navigate(['/vehicle-model'], {
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
        this.translateService.get('niopdcgatewayApp.vehicleModel.home.title').subscribe(title => {
            this.breadcrumbItems.push({label: title});
        });
    }

    ngOnInit() {
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });

        this.registerChangeInVehicleModels();

        this.setBreadCrumb();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: VehicleModel) {
        return item.id;
    }

    registerChangeInVehicleModels() {
        this.eventSubscriber = this.eventManager.subscribe('vehicleModelListModification', response => {
            log(response);
            this.loadAll();
        });
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

            this.router.navigate(['/vehicle-model'], {
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
        this.vehicleModels = data;
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

}

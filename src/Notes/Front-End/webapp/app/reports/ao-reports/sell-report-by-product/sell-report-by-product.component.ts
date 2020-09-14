import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiParseLinks, JhiAlertService} from 'ng-jhipster';

import {TranslateService} from '@ngx-translate/core';
import {SellReportByProduct, SellReportByProductRequest} from './sell-report-by-product.model';
import {SellReportByProductService} from './sell-report-by-product.service';
import {DataStateChangeEvent} from '@progress/kendo-angular-grid';
import {process, State} from '@progress/kendo-data-query';
import {RefuelCenterService} from '../../../entities/ao-entities/refuel-center/refuel-center.service';
import {RefuelCenter} from '../../../entities/ao-entities/refuel-center/refuel-center.model';
import {Person, PersonService} from '../../../entities/person';
import {Customer, CustomerService} from '../../../entities/customer';
import {MetreSheetService} from '../metre-sheet';
import {Principal} from '../../../shared';

@Component({
    selector: 'jhi-sell-report-by-product',
    templateUrl: './sell-report-by-product.component.html'
})
export class SellReportByProductComponent implements OnInit, OnDestroy {

    currentAccount: any;
    sellReportByProduct: SellReportByProduct[] = [];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    breadcrumbItems: any[];
    req: SellReportByProductRequest = new SellReportByProductRequest({});
    aggregates: any[] = [{field: 'amount', aggregate: 'sum'}];
    state: State = {take: 10};
    gridData: any = process(this.sellReportByProduct, this.state);

    refuelCenters: RefuelCenter[];
    refuelCenterId: number;
    persons: Person[];
    personId: number;
    customers: Customer[];
    customerId: number;
    date: any;
    fullName: String;

    constructor(
        private sellReportByProductService: SellReportByProductService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private translateService: TranslateService,
        private refuelCenterService: RefuelCenterService,
        private personService: PersonService,
        private customerService: CustomerService,
        private principal: Principal,
        private metreSheetService: MetreSheetService,
    ) {
    }

    loadAll() {
        this.sellReportByProductService.query(this.req).subscribe(
            (res: HttpResponse<SellReportByProduct[]>) => this.onSuccess(res.body),
            (res: HttpErrorResponse) => this.onError(res.error)
        );
    }

    setBreadCrumb() {

        this.metreSheetService.getDate().subscribe(res => {
            this.date = res.body;
        },res => this.onError(res.message));
        this.fullName = this.principal.getFullName();

        this.breadcrumbItems = [];
        this.translateService.get('global.menu.home').subscribe(title => {
            this.breadcrumbItems.push({label: title, routerLink: ['/']});
        });
        this.translateService.get('niopdcgatewayApp.sellReportByProduct.home.title').subscribe(title => {
            this.breadcrumbItems.push({label: title});
        });
    }

    ngOnInit() {
        this.setBreadCrumb();
        this.refuelCenterService.queryByNational(true)
            .subscribe(res => {
                this.refuelCenters = res.body;
                this.req.refuelCenterId = this.refuelCenters[0].id;
            },res => this.onError(res.message));

        this.personService.query()
            .subscribe(res => {
                this.persons = res.body;
            },res => this.onError(res.message));
        this.customerService.query()
            .subscribe(res => {
                this.customers = res.body;
            },res => this.onError(res.message));

        this.req.startDate = new Date();
        this.req.startDate.setHours(0);
        this.req.startDate.setMinutes(0);
        this.req.startDate.setSeconds(0);
        this.req.finishDate = new Date();
        this.req.finishDate.setHours(23);
        this.req.finishDate.setMinutes(59);
        this.req.finishDate.setSeconds(59);

    }

    ngOnDestroy() {
    }

    private onSuccess(data) {
        this.sellReportByProduct = data;
        this.state = this.req.state;
        if (this.state && this.state.group) {
            this.state.group.map(group => group.aggregates = this.aggregates);
        }
        this.state.take = this.sellReportByProduct.length;
        this.state.skip = 0;
        this.gridData = process(this.sellReportByProduct, this.state);
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        this.req.state = state;
        this.loadAll();
    }
}

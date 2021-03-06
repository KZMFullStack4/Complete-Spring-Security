import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiAlertService, JhiParseLinks} from 'ng-jhipster';

import {TranslateService} from '@ngx-translate/core';

import {StimulsoftService} from '../../../shared/stimulsoft/stimulsoft.service';
import {ScriptService} from '../../../shared/script/script.service';
import {DateJalaliPipe} from '../../../shared/ng2-datetimepicker-jalali/date-jalali.pipe';
import {MetreSheet} from './metre-sheet.model';
import {Principal} from '../../../shared';
import {DateTimeJalaliPipe} from 'app/shared/ng2-datetimepicker-jalali';

@Component({
    selector: 'jhi-metre-sheet-report',
    templateUrl: './metre-sheet-report.component.html'
})
export class MetreSheetReportComponent implements OnInit/*, OnDestroy */ {
    @Input() metreSheet: MetreSheet[] = [];
    @Input() mode: string;
    @Input() refuelCenterTitle: string;
    @Output() onClose = new EventEmitter();
    currentAccount: any;
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    breadcrumbItems: any[];
    orderId: number;
    json = {
        info: {},
        report: []
    };

    report: any;

    constructor(
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private activatedRoute: ActivatedRoute,
        private stimulsfotSerive: StimulsoftService,
        private router: Router,
        private principal: Principal,
        private script: ScriptService,
        private translateService: TranslateService
    ) {
        this.orderId = activatedRoute.snapshot.params['orderId'];
        this.mode = activatedRoute.snapshot.params['mode'];

    }

    setBreadCrumb() {
        this.breadcrumbItems = [];
        this.translateService.get('global.menu.home').subscribe(title => {
            this.breadcrumbItems.push({label: title, routerLink: ['/']});
        });
        this.translateService.get('niopdcgatewayApp.order.home.boundarySell').subscribe(title => {
            this.breadcrumbItems.push({label: title, routerLink: ['/boundary-sell']});
        });
        this.translateService.get('niopdcgatewayApp.order.home.report').subscribe(title => {
            this.breadcrumbItems.push({label: title});
        });
    }

    async ngOnInit() {
        const data = await this.script.load('stimulsoft.reports');
        const data2 = await this.script.load('stimulsoft.viewer');
        console.log('script loaded ', data);
        console.log('script loaded ', data2);
        const options = new Stimulsoft.Viewer.StiViewerOptions();
        options.exports.showExportToPdf = false;
        options.toolbar.showPrintButton = true;
        options.toolbar.showAboutButton = false;
        options.exports.showExportToDocument = false;
        options.exports.showExportToImageJpeg = true;
        options.appearance.scrollbarsMode = true;
        const viewer: any = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
        Stimulsoft.Base.StiFontCollection.addOpentypeFontFile('/content/mrt/BMitra1.ttf', 'B Mitra');

        this.json.report = this.metreSheet;
        this.json.info['printDate'] = new DateJalaliPipe().transform(new Date());
        const modeTitle = (this.mode === 'ao') ? 'عملیات' : 'انبار';
        this.json.info['refuelCenter'] = `گزارش میترشیت ${modeTitle} مرکز سوختگیری  ${this.refuelCenterTitle}`;
        this.json.info['username'] = this.principal.getFullName();
        this.json.report.forEach(value => {
            value.dateTime = new DateTimeJalaliPipe().transform(value.dateTime);
            if (value.type === 'RE_FUEL') {
                value.type = 'REFUEL';
            }
        });
        const report = new Stimulsoft.Report.StiReport();
        report.loadFile('/content/mrt/MetreSheet.mrt');
        const dataSet = new Stimulsoft.System.Data.DataSet('Demo');
        const strJson = JSON.stringify(this.json);
        dataSet.readJson(strJson);
        report.dictionary.databases.clear();
        report.regData('Demo', 'Demo', dataSet);
        viewer.report = report;

        console.log('Rendering the viewer to selected element');
        viewer.renderHtml('viewer');
        this.setBreadCrumb();

    }

    onCloseReport() {
        this.onClose.emit();
    }
}

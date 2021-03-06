import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NiopdcgatewaySharedModule} from '../../../shared';
import {RouterModule} from '@angular/router';
import {totalSellRoute} from './total-sell.route';
import {TotalSellComponent} from './total-sell.component';
import {TotalSellService} from './total-sell.service';
import {JhiLanguageHelper} from 'app/core/language.helper';
import {JhiLanguageService} from 'ng-jhipster';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        NiopdcgatewaySharedModule,
        RouterModule.forRoot(totalSellRoute, {useHash: true})
    ],
    declarations: [
        TotalSellComponent,
    ],
    entryComponents: [
        TotalSellComponent,
    ],
    providers: [
        TotalSellService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NiopdcgatewayTotalSellModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}

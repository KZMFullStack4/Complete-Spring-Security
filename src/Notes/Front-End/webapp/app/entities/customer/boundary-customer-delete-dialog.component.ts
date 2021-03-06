import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Customer } from './customer.model';
import { CustomerPopupService } from './customer-popup.service';
import { CustomerService } from './customer.service';

@Component({
    selector: 'jhi-boundary-customer-delete-dialog',
    templateUrl: './boundary-customer-delete-dialog.component.html'
})
export class BoundaryCustomerDeleteDialogComponent {

    customer: Customer;

    constructor(
        private customerService: CustomerService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.customerService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'customerListModification',
                content: 'Deleted an customer'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-boundary-customer-delete-popup',
    template: ''
})
export class BoundaryCustomerDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;
    constructor(
        private route: ActivatedRoute,
        private customerPopupService: CustomerPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.customerPopupService
                .open(BoundaryCustomerDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

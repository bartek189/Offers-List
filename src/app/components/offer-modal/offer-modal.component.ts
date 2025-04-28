import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {KinguinOffer, Seller} from '../../models/offer.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NgxPermissionsModule} from "ngx-permissions";

@Component({
    selector: 'app-offer-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPermissionsModule],
    templateUrl: './offer-modal.component.html',
    styleUrls: ['./offer-modal.component.css'],
    animations: [
        trigger('modalAnimation', [
            state('void', style({
                transform: 'scale(0.8)',
                opacity: 0
            })),
            transition('void => *', [
                animate('200ms ease-out')
            ]),
            transition('* => void', [
                animate('200ms ease-in')
            ])
        ]),
        trigger('formControlAnimation', [
            state('void', style({
                opacity: 0,
                transform: 'translateY(10px)'
            })),
            transition('void => *', [
                animate('300ms {{delay}}ms ease-out')
            ], {params: {delay: 0}})
        ])
    ]
})
export class OfferModalComponent implements OnInit {
    @Input() offer!: KinguinOffer;
    @Input() allSellers: Seller[] = [];
    offerForm!: FormGroup;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.setupFormListeners();
    }

    initForm(): void {
        this.offerForm = this.fb.group({
            productName: [this.offer.productName, Validators.required],
            popularityValue: [this.offer.popularityValue, Validators.required],
            isPreorder: [this.offer.isPreorder],
            type: [this.offer.type || 'kinguin', Validators.required],
            price: [this.offer.price.amount / 100, Validators.required],
            currency: [this.offer.price.currency || 'EUR', Validators.required],
            seller: [this.offer.seller.id.toString(), Validators.required],
            activeStockNumber: [this.offer.activeStockNumber, Validators.required]
        });
    }

    setupFormListeners(): void {
        this.offerForm.get('currency')?.valueChanges.subscribe(value => {
            this.offerForm.get('price')?.setValue('');
        });

        this.offerForm.get('type')?.valueChanges.subscribe(value => {
            if (value === 'other') {
                this.offerForm.get('seller')?.setValue('');
            }
        });

        this.offerForm.get('isPreorder')?.valueChanges.subscribe(isPreorder => {
            const popularityValueControl = this.offerForm.get('popularityValue');
            if (isPreorder) {
                popularityValueControl?.setValue(0);
                popularityValueControl?.disable();
            } else {
                popularityValueControl?.enable();
            }
        });
    }


    getAnimationDelay(index: number): { delay: number } {
        return {delay: 50 * index};
    }
}

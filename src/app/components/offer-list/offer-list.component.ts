import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpErrorResponse} from '@angular/common/http';
import {OfferService} from '../../services/offer.service';
import {KinguinOffer, Seller} from '../../models/offer.model';
import {OfferModalComponent} from '../offer-modal/offer-modal.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NgxPermissionsModule} from "ngx-permissions";
import {debounceTime, Subject, takeUntil} from "rxjs";

@Component({
    selector: 'app-offer-list',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbAlert, NgxPermissionsModule],
    templateUrl: './offer-list.component.html',
    styleUrls: ['./offer-list.component.css'],
    animations: [
        trigger('cardAnimation', [
            state('void', style({
                opacity: 0,
                transform: 'translateY(20px)'
            })),
            transition('void => *', [
                animate('300ms ease-out')
            ])
        ]),
        trigger('fadeIn', [
            state('void', style({
                opacity: 0
            })),
            transition('void => *', [
                animate('400ms ease-in')
            ])
        ])
    ]
})
export class OfferListComponent implements OnInit {
    @Input() viewOnly = false;

    offerId = '';
    offers: KinguinOffer[] = [];
    isLoading = false;
    error: string | null = null;
    private offerIdChanged$ = new Subject<string>();
    private destroy$ = new Subject<void>();


    constructor(
        private offerService: OfferService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                if (params['id']) {
                    this.offerId = params['id'];
                    this.fetchOffers();
                }
            });

        this.offerIdChanged$.pipe(
            debounceTime(1000),
            takeUntil(this.destroy$)
        ).subscribe(id => {
            this.offerId = id;
            this.updateQueryParams();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onIdChange(): void {
        this.offerIdChanged$.next(this.offerId);
    }

    updateQueryParams(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {id: this.offerId || null},
            queryParamsHandling: 'merge'
        });
    }

    fetchOffers(): void {
        if (!this.offerId) {
            return;
        }

        this.isLoading = true;
        this.error = null;

        this.offerService.getOffers(this.offerId).subscribe({
            next: (offers) => {
                this.offers = offers;
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error in component while fetching offers:', err);
                this.error = `Failed to load offers: ${err.message}`;
                this.isLoading = false;
            }
        });
    }

    openOfferModal(offer: KinguinOffer): void {
        if (this.viewOnly) {
            return;
        }


        const modalRef = this.modalService.open(OfferModalComponent, {size: 'lg'});
        modalRef.componentInstance.offer = offer;
        modalRef.componentInstance.allSellers = this.getAllUniqueSellers();
    }

    private getAllUniqueSellers(): Seller[] {
        const uniqueSellers = new Map<string, Seller>();

        this.offers.forEach(offer => {
            if (offer.seller && !uniqueSellers.has(offer.seller.id.toString())) {
                uniqueSellers.set(offer.seller.id.toString(), offer.seller);
            }
        });

        return Array.from(uniqueSellers.values());
    }
}

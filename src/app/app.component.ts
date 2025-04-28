import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {OfferListComponent} from './components/offer-list/offer-list.component';
import {NgxPermissionsService} from "ngx-permissions";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        OfferListComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    viewOnly = false;

    constructor(private permissionsService: NgxPermissionsService) {
        this.permissionsService.loadPermissions(['EDIT']);
    }

    toggleViewOnly(value: boolean): void {
        this.viewOnly = value;

        if (value) {
            this.permissionsService.removePermission('EDIT');
        } else {
            this.permissionsService.addPermission('EDIT');
        }
    }
}

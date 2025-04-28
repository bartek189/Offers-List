import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {testHeaderInterceptor} from "./interceptors/test-header.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {NgxPermissionsModule} from "ngx-permissions";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([testHeaderInterceptor])
        ),
        provideAnimations(),
        importProvidersFrom(NgxPermissionsModule.forRoot())
    ]
};
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AuthModule } from './auth/auth-module';
import { Home } from './pages/home/home';
import { Camera, ChevronDown, LogOut, LucideAngularModule, User, Code } from 'lucide-angular';
import { Profile } from './pages/profile/profile';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authInterceptor } from './auth-interceptor';
import { ThreadDetails } from './pages/thread-details/thread-details';
import { TimeAgoPipe } from './pipes/time-ago-pipe';

@NgModule({
  declarations: [
    App,
    Home,
    Profile,
    ThreadDetails,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AuthModule,
    FormsModule,
    LucideAngularModule.pick({ LogOut, ChevronDown, User, Camera, Code })
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }

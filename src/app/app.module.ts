import { environment } from "./../environments/environment.prod";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { WriteOfferComponent } from "./hire/write-offer/write-offer.component";
import { AnonymousGuardService } from "./services/anonymous-guard.service";
import { BrowserModule, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { NgProgressModule } from "@ngx-progressbar/core";

import { NgRedux, NgReduxModule } from '@angular-redux/store';
import {IAppState, rootReducer, INITIAL_STATE} from './store';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbModule,
  NgbDatepickerConfig,
  NgbDateParserFormatter,
  NgbDateAdapter,
  NgbDateStruct,
  NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgbDateFRParserFormatter } from "./ngb-date-fr-parser-formatter";
import { ToastrModule } from "ngx-toastr";
import { TypeaheadModule } from "ngx-bootstrap";
import { routing } from "./app.routing";
import { NgSelectModule, NgOption } from "@ng-select/ng-select";
import { ContentLoaderModule } from "@netbasal/content-loader";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from "@angular/material";
import { AppComponent } from "./app.component";
import { RegisterComponent } from "./auth/register/register.component";
import { LoginComponent } from "./auth/login/login.component";

import { AuthService } from "./services/auth.service";
import { IndividualRegisterComponent } from "./auth/register/individual-register/individual-register.component";
import { CompanyRegisterComponent } from "./auth/register/company-register/company-register.component";

import { HttpClientModule } from "@angular/common/http";
import { RegistrationService } from "./services/registration.service";
import { EqualValidatorDirective } from "./equal-validator.directive";

import { HireOrServeComponent } from "./hire-or-serve/hire-or-serve.component";
import { AuthGuard } from "./services/auth-guard.service";

import { AboutYourselfComponent } from "./individual-forms/about-yourself/about-yourself.component";
import { IndividualQualificationComponent } from "./individual-forms/individual-qualification/individual-qualification.component";
import { WorkExperienceComponent } from "./individual-forms/work-experience/work-experience.component";
import { AwardComponent } from "./individual-forms/award/award.component";
import { IndividualService } from "./services/individual.service";
import { AboutCompanyComponent } from "./company-forms/about-company/about-company.component";
import { CompanyBackgroundComponent } from "./company-forms/company-background/company-background.component";
import { CompanyValueComponent } from "./company-forms/company-value/company-value.component";
import { PrivateHeaderComponent } from "./_layout/private-header/private-header.component";
import { PrivateLayoutComponent } from "./_layout/private-layout/private-layout.component";
import { CompanyService } from "./services/company.service";
import { RoleGuardService } from "./services/role-guard.service";
import { WriteOfferService } from "./services/write-offer.service";
import { TruncatePipe } from "./truncatePipe";
import { JobsComponent } from "./work/jobs/jobs.component";
import { JobService } from "./services/job.service";
import { HireAppliedComponent } from "./hire/hire-applied/hire-applied.component";
import { WorkAppliedComponent } from "./work/work-applied/work-applied.component";
import { WorkAssignedComponent } from "./work/work-assigned/work-assigned.component";
import { HireAssignedComponent } from "./hire/hire-assigned/hire-assigned.component";
import { WorkDashboardService } from "./services/work-dashboard.service";
import { ForgetPasswordComponent } from "./auth/forget-password/forget-password.component";
import { HireDashboardService } from "./services/hire-dashboard.service";
import { StarRatingComponent } from "./hire/star-rating/star-rating.component";
import { IndividualSettingsComponent } from "./settings/individual-settings/individual-settings.component";
import { CompanySettingsComponent } from "./settings/company-settings/company-settings.component";
import { ChangePasswordComponent } from "./auth/change-password/change-password.component";
import { PasswordRecoveryComponent } from "./auth/password-recovery/password-recovery.component";
import { TimePipe } from "./timePipe";
import { MessageTimePipe } from "./message-timePipe";
import { FeedbackComponent } from "./feedback/feedback.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SharedProfileService } from "./services/shared-profile.service";
import { ErrorModalComponent } from "./common/error-modal/error-modal.component";
import { ErrorHandlerService } from "./services/error-handler.service";
import { GoogleAnalyticsService } from "./services/google-analytics.service";
import { CookiePolicyComponent } from "./policies/cookie-policy/cookie-policy.component";
import { TermsOfUseComponent } from "./policies/terms-of-use/terms-of-use.component";
import { PrivacyPolicyComponent } from "./policies/privacy-policy/privacy-policy.component";
import { PublicLayoutComponent } from "./_layout/public-layout/public-layout.component";
import { PublicJobsComponent } from "./public/public-jobs/public-jobs.component";
import { PublicWriteOfferComponent } from "./public/public-write-offer/public-write-offer.component";
import { responsiveService } from "./services/responsive.service";
import { JobDetailsComponent } from "./work/job-details/job-details.component";
import { JobDetailsService } from "./services/job-details.service";
import { FavouriteService } from "./services/favourite.service";
import { CommonService } from "./services/common.service";
import { ShareButtonsModule } from "ngx-sharebuttons";
import { HttpModule } from "@angular/http";

import { SwiperModule } from "ngx-swiper-wrapper";
import { SWIPER_CONFIG } from "ngx-swiper-wrapper";
import { SwiperConfigInterface } from "ngx-swiper-wrapper";
import { AmazingTimePickerModule } from "amazing-time-picker";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

import { CharacterCountdownPipe } from "./character-countdown.pipe";
import { PrvCompProfContentComponent } from "./common/prv-comp-prof-content/prv-comp-prof-content.component";
import { PrvIndvProfContentComponent } from "./common/prv-indv-prof-content/prv-indv-prof-content.component";
import { PrvJobContentComponent } from "./common/prv-job-content/prv-job-content.component";
import { JobShareComponent } from "./common/job-share/job-share.component";
import { JobCardComponent } from "./common/job-card/job-card.component";
import { FirstStepFieldsComponent } from "./common/write-offer/first-step-fields/first-step-fields.component";
import { SecondStepFieldsComponent } from "./common/write-offer/second-step-fields/second-step-fields.component";
import { FourthStepFieldsComponent } from "./common/write-offer/fourth-step-fields/fourth-step-fields.component";
import { WriteOfferFieldsErrModalComponent } from "./common/write-offer-fields-err-modal/write-offer-fields-err-modal.component";
import { PublicHeaderComponent } from "./_layout/public-header/public-header.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { JobsFilterModalComponent } from "./common/jobs-filter-modal/jobs-filter-modal.component";
import { JobLoaderComponent } from "./common/loaders/job-loader/job-loader.component";
import { ProfileLoaderComponent } from "./common/loaders/profile-loader/profile-loader.component";
import { ApplicationsLoaderComponent } from "./common/loaders/applications-loader/applications-loader.component";
import { HireAppliedFilterModalComponent } from "./common/hire-applied-filter-modal/hire-applied-filter-modal.component";
import { ChatDetailComponent } from "./chat/chat-detail/chat-detail.component";
import { ChatInputComponent } from "./chat/chat-input/chat-input.component";
import { ChatMessageComponent } from "./chat/chat-message/chat-message.component";
import { ChatMessagesComponent } from "./chat/chat-messages/chat-messages.component";
import { ChatThreadComponent } from "./chat/chat-thread/chat-thread.component";
import { ChatThreadsComponent } from "./chat/chat-threads/chat-threads.component";
import { MessageService } from "./chat/message.service";
import { ThreadService } from "./chat/thread.service";
import {TimeAgoPipe} from 'time-ago-pipe';
import { ChatPopupComponent } from './chat/chat-popup/chat-popup.component';
import { Notification } from "rxjs";
import { NotificationService } from "./notification/notification.service";
import { ThousandNumberFormatPipe } from './thousand-number-format.pipe';
import { NotificationsComponent } from './notification/notifications/notifications.component';
import { NotificationComponent } from './notification/notification/notification.component';
import { NoDataFoundComponent } from './common/error-messages/no-data-found/no-data-found.component';
import { JobsLoaderComponent } from './common/loaders/jobs-loader/jobs-loader.component';
import { PageNotFoundComponent } from './others/page-not-found/page-not-found.component';
import { AllJobsComponent } from './common/all-jobs/all-jobs.component';
import { JobPreviewComponent } from './common/modals/job-preview/job-preview.component';
import { ProfilePreviewComponent } from './common/modals/profile-preview/profile-preview.component';
import { VerifyComponent } from './auth/register/verify/verify.component';
import { BasicDetailsGuard } from "./auth/basic-details.guard";
import { ProfileComponent } from './auth/profile/profile.component';
import { BasicDetailsComponent } from './auth/basic-details/basic-details.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: "horizontal",
  slidesPerView: "auto",
};

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    IndividualRegisterComponent,
    CompanyRegisterComponent,
    EqualValidatorDirective,
    HireOrServeComponent,
    AboutYourselfComponent,
    IndividualQualificationComponent,
    WorkExperienceComponent,
    AwardComponent,
    AboutCompanyComponent,
    CompanyBackgroundComponent,
    CompanyValueComponent,
    PrivateHeaderComponent,
    PrivateLayoutComponent,
    WriteOfferComponent,
    TruncatePipe,
    TimePipe,
    MessageTimePipe,
    JobsComponent,
    HireAppliedComponent,
    WorkAppliedComponent,
    WorkAssignedComponent,
    HireAssignedComponent,
    ForgetPasswordComponent,
    StarRatingComponent,
    IndividualSettingsComponent,
    CompanySettingsComponent,
    ChangePasswordComponent,
    PasswordRecoveryComponent,
    FeedbackComponent,
    ErrorModalComponent,
    CookiePolicyComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent,
    PublicLayoutComponent,
    PublicJobsComponent,
    PublicWriteOfferComponent,
    JobDetailsComponent,
    CharacterCountdownPipe,
    PrvCompProfContentComponent,
    PrvIndvProfContentComponent,
    PrvJobContentComponent,
    JobShareComponent,
    JobCardComponent,
    FirstStepFieldsComponent,
    SecondStepFieldsComponent,
    FourthStepFieldsComponent,
    WriteOfferFieldsErrModalComponent,
    PublicHeaderComponent,
    WelcomeComponent,
    ContactUsComponent,
    JobsFilterModalComponent,
    JobLoaderComponent,
    ProfileLoaderComponent,
    ApplicationsLoaderComponent,
    HireAppliedFilterModalComponent,
    ChatDetailComponent,
    ChatInputComponent,
    ChatMessageComponent,
    ChatMessagesComponent,
    ChatThreadComponent,
    ChatThreadsComponent,
    TimeAgoPipe,
    ChatPopupComponent,
    ThousandNumberFormatPipe,
    NotificationsComponent,
    NotificationComponent,
    NoDataFoundComponent,
    JobsLoaderComponent,
    PageNotFoundComponent,
    AllJobsComponent,
    JobPreviewComponent,
    ProfilePreviewComponent,
    VerifyComponent,
    ProfileComponent,
    BasicDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: "toast-bottom-full-width",
      preventDuplicates: true,
    }),
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    NgSelectModule,
    InfiniteScrollModule,
    NgbTypeaheadModule,
    ContentLoaderModule,
    TypeaheadModule.forRoot(),
    NgbModule.forRoot(),
    NgProgressModule.forRoot(),
    HttpModule, // needed for ShareButtonsModule
    ShareButtonsModule.forRoot(),
    SwiperModule,
    AmazingTimePickerModule,
    CKEditorModule,
    Ng4GeoautocompleteModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgReduxModule
  ],
  providers: [
    Title,
    AuthService,
    RegistrationService,
    AuthGuard,
    BasicDetailsGuard,
    IndividualService,
    AnonymousGuardService,
    CompanyService,
    RoleGuardService,
    WriteOfferService,
    JobService,
    WorkDashboardService,
    HireDashboardService,
    SharedProfileService,
    ErrorHandlerService,
    GoogleAnalyticsService,
    responsiveService,
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter },
    JobDetailsService,
    FavouriteService,
    CommonService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG,
    },
    MessageService,
    ThreadService,
    NotificationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    protected _googleAnalyticsService: GoogleAnalyticsService,
    ngRedux: NgRedux<IAppState>
  ) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE)
  }
}

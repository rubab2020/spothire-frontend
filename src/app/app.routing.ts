import { PublicWriteOfferComponent } from "./public/public-write-offer/public-write-offer.component";
import { PublicLayoutComponent } from "./_layout/public-layout/public-layout.component";
import { PublicJobsComponent } from "./public/public-jobs/public-jobs.component";
import { PrivacyPolicyComponent } from "./policies/privacy-policy/privacy-policy.component";
// import { BillingComponent } from './billing/billing.component';
// import { BillingLayoutComponent } from './_layout/billing-layout/billing-layout.component';
// import { FeedbackComponent } from './feedback/feedback.component';
import { PasswordRecoveryComponent } from "./auth/password-recovery/password-recovery.component";
import { ChangePasswordComponent } from "./auth/change-password/change-password.component";
// import { MessageLayoutComponent } from './messaging/message-layout/message-layout.component';
// import { ProfileLayoutComponent } from './_layout/profile-layout/profile-layout.component';
// import { SettingsLayoutComponent } from './_layout/settings-layout/settings-layout.component';
import { IndividualSettingsComponent } from "./settings/individual-settings/individual-settings.component";
import { CompanySettingsComponent } from "./settings/company-settings/company-settings.component";
// import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HireAssignedComponent } from "./hire/hire-assigned/hire-assigned.component";
import { WorkAssignedComponent } from "./work/work-assigned/work-assigned.component";
import { WorkAppliedComponent } from "./work/work-applied/work-applied.component";
// import { WorkLayoutComponent } from './_layout/work-layout/work-layout.component';
import { HireAppliedComponent } from "./hire/hire-applied/hire-applied.component";
import { JobsComponent } from "./work/jobs/jobs.component";
// import { IndividualProfileComponent } from './profile/individual-profile/individual-profile.component';
// import { CompanyProfileComponent } from './profile/company-profile/company-profile.component';
import { WriteOfferComponent } from "./hire/write-offer/write-offer.component";
// import { HireServeLayoutComponent } from './_layout/hire-serve-layout/hire-serve-layout.component';
import { CompanyValueComponent } from "./company-forms/company-value/company-value.component";
import { AboutCompanyComponent } from "./company-forms/about-company/about-company.component";
import { PrivateLayoutComponent } from "./_layout/private-layout/private-layout.component";

import { IndividualRegisterComponent } from "./auth/register/individual-register/individual-register.component";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { CompanyRegisterComponent } from "./auth/register/company-register/company-register.component";

import { HireOrServeComponent } from "./hire-or-serve/hire-or-serve.component";
import { AuthGuard } from "./services/auth-guard.service";

// import { IndFormLayoutComponent } from './_layout/ind-form-layout/ind-form-layout.component';

import { IndividualQualificationComponent } from "./individual-forms/individual-qualification/individual-qualification.component";

import { AboutYourselfComponent } from "./individual-forms/about-yourself/about-yourself.component";

import { WorkExperienceComponent } from "./individual-forms/work-experience/work-experience.component";

import { AwardComponent } from "./individual-forms/award/award.component";
import { CompanyBackgroundComponent } from "./company-forms/company-background/company-background.component";
import { AnonymousGuardService } from "./services/anonymous-guard.service";
import { RoleGuardService } from "./services/role-guard.service";
import { CookiePolicyComponent } from "./policies/cookie-policy/cookie-policy.component";
import { TermsOfUseComponent } from "./policies/terms-of-use/terms-of-use.component";
import { JobDetailsComponent } from "./work/job-details/job-details.component";
import { environment } from "../environments/environment";
import { WelcomeComponent } from "./welcome/welcome.component";
import { ChatDetailComponent } from "./chat/chat-detail/chat-detail.component";
// import { ChatListComponent } from "./chat/chat-list/chat-list.component";
import { ChatThreadsComponent } from "./chat/chat-threads/chat-threads.component";
import { NotificationsComponent } from "./notification/notifications/notifications.component";
import { PageNotFoundComponent } from "./others/page-not-found/page-not-found.component";
import { VerifyComponent } from "./auth/register/verify/verify.component";
import { BasicDetailsComponent } from "./auth/basic-details/basic-details.component";
import { ProfileComponent } from "./auth/profile/profile.component";
import { BasicDetailsGuard } from "./auth/basic-details.guard";

const INDV_NAME = environment.individualName;
const COMP_NAME = environment.companyName;

const appRoutes: Routes = [
  // --------------------------------------------
  // ------------- private routes ----------------
  // --------------------------------------------
  {
    path: "individual",
    component: PrivateLayoutComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: INDV_NAME,
    },
    children: [
      {
        path: "settings",
        component: PrivateLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: "individual-settings",
            component: IndividualSettingsComponent,
            data: { title: "Settings | Yaywerk" },
          },
          {
            path: "company-settings",
            component: CompanySettingsComponent,
            data: { title: "Settings | Yaywerk" },
          },
        ],
      },
      {
        path: "about-yourself",
        component: AboutYourselfComponent,
        data: { title: "About Yourself | Yaywerk" },
      },
      {
        path: "qualification",
        component: IndividualQualificationComponent,
        data: { title: "Qualification | Yaywerk" },
      },
      {
        path: "work-experience",
        component: WorkExperienceComponent,
        data: { title: "Work Experience | Yaywerk" },
      },
      {
        path: "award",
        component: AwardComponent,
        data: { title: "Awards | Yaywerk" },
      },
    ],
  },
  {
    path: "company",
    component: PrivateLayoutComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: COMP_NAME,
    },
    children: [
      {
        path: "introduction",
        component: AboutCompanyComponent,
        data: { title: "About Company | Yaywerk" },
      },
      {
        path: "company-background",
        component: CompanyBackgroundComponent,
        data: { title: "Company Background | Yaywerk" },
      },
      {
        path: "company-value",
        component: CompanyValueComponent,
        data: { title: "Comapany value | Yaywerk" },
      },
    ],
  },
  {
    path: "work",
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "jobs",
        component: JobsComponent,
        data: { title: "Job Circular | Yaywerk" },
      },
      {
        path: "applied",
        component: WorkAppliedComponent,
        data: { title: "Applied | Yaywerk" },
      },
      {
        path: "hired",
        component: WorkAssignedComponent,
        data: { title: "Hired | Yaywerk" },
      },
    ],
  },
  {
    path: "hire",
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "write-offer",
        component: WriteOfferComponent,
        data: { title: "Write Offer | Yaywerk" },
      },
      {
        path: "applied",
        component: HireAppliedComponent,
        data: { title: "Applied | Yaywerk" },
      },
      {
        path: "hired",
        component: HireAssignedComponent,
        data: { title: "Hired | Yaywerk" },
      },
    ],
  },
  {
    path: "settings",
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "individual-settings",
        component: IndividualSettingsComponent,
        data: { title: "Settings | Yaywerk" },
      },
      {
        path: "company-settings",
        component: CompanySettingsComponent,
        data: { title: "Settings | Yaywerk" },
      },
    ],
  },
  {
    path: "hire-or-serve",
    component: HireOrServeComponent,
    canActivate: [AuthGuard],
    data: { title: "Hire or Serve | Yaywerk" },
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
    data: { title: "Change Password | Yaywerk" },
  },

  // {path: '', loadChildren: './chat/chat.module#chatModule', canActivate: [AuthGuard] },
  {
    path: "chat/:threadId/sid/:senderId",
    component: ChatDetailComponent,
    canActivate: [AuthGuard],
    data: { title: "Chat Detail | Yaywerk" },
  },
  {
    path: "chat",
    component: ChatThreadsComponent,
    canActivate: [AuthGuard],
    data: { title: "Chat | Yaywerk" },
  },

  {
    path: "notifications",
    component: NotificationsComponent,
    canActivate: [AuthGuard],
    data: { title: "Notifications | Yaywerk" },
  },

  {
    path: "profile",
    component: PrivateLayoutComponent,
    children: [
      {
          path: "basic-details",
          component: BasicDetailsComponent,
          canActivate: [AuthGuard, BasicDetailsGuard],
          data: { title: "About Yourself | Yaywerk" },
      },
      {
        path: "details",
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { title: "Profile Details | Yaywerk" },
      },
    ],
  },

  //  {
  //     path: 'profile',
  //     component: ProfileLayoutComponent,canActivate:[AuthGuard],
  //     children: [
  //         { path: 'company-profile', component: CompanyProfileComponent, data: { title: 'Profile | Yaywerk' } },
  // { path: 'individual-profile', component: IndividualProfileComponent, data: { title: 'Profile | Yaywerk' } },
  //     ]
  //  },
  //  {
  //     path: 'billing',canActivate:[AuthGuard],
  //     component: BillingLayoutComponent,
  //     children: [
  //         { path: 'billing-info', component: BillingComponent, data: { title: 'Billing | Yaywerk' } }
  //     ]
  //  },

  // --------------------------------------------
  // ------------- both public & private routes ----------------
  // --------------------------------------------
  {
    path: "jobs/:slug",
    component: JobDetailsComponent,
    data: { title: "Job Details | Yaywerk" },
  },

  // --------------------------------------------
  // ------------- public routes ----------------
  // --------------------------------------------
  {
    path: "",
    component: WelcomeComponent,
    canActivate: [AnonymousGuardService],
    data: { title: "Yaywerk" },
  },
  {
    path: "",
    component: PublicLayoutComponent,
    children: [
      {
        path: "jobs",
        component: PublicJobsComponent,
        data: { title: "Job Circular | Yaywerk" },
      },
      {
        path: "write-offer",
        component: PublicWriteOfferComponent,
        data: { title: "Write Offer | Yaywerk" },
      },
      {
        path: "recover-password",
        component: PasswordRecoveryComponent,
        data: { title: "Recover Password | Yaywerk" },
      },
    ],
  },
  // { path: 'register', component: RegisterComponent },
  // { path: 'individual-register', component: IndividualRegisterComponent },
  // { path: 'company-register', component: CompanyRegisterComponent },
  // { path: 'login', component: LoginComponent,canActivate: [AnonymousGuardService]},
  // { path: 'logout', component: LoginComponent ,canActivate:[AuthGuard] },
  {
    path: "policy/cookie",
    component: CookiePolicyComponent,
    data: { title: "Cookie Policy | Yaywerk" },
  },
  {
    path: "policy/privacy",
    component: PrivacyPolicyComponent,
    data: { title: "Privacy Policy | Yaywerk" },
  },
  {
    path: "policy/terms-of-use",
    component: TermsOfUseComponent,
    data: { title: "Terms Of Use | Yaywerk" },
  },
  {
    path: "verify/:phone",
    component: VerifyComponent,
    data: { title: "Verify | Yaywerk" },
  },
  // { path: 'test', component: IndFormLayoutComponent },
  // { path: 'message', component: MessageLayoutComponent },
  // otherwise redirect to home
  // { path: 'login/:message', component: RegisterComponent },
  // { path: 'forget-password', component: ForgetPasswordComponent, data: { title: 'Password | Yaywerk' }},
  // { path: 'feedback', component: FeedbackComponent, data: { title: 'Feedback | Yaywerk' }},
  // {path: 'no-access', component: NoAccessComponent},
  {path: 'page-not-found', component: PageNotFoundComponent},
  { path: "**", redirectTo: "/page-not-found" },
];

export const routing = RouterModule.forRoot(appRoutes);

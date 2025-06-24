// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: "http://192.168.150.108",
  // apiUrl: "http://192.168.101.11",
  // apiUrl: "http://192.168.43.100",
  // apiUrl: "http://192.168.0.105",
  // apiUrl: "http://192.168.0.106",
  // apiUrl: "http://192.168.1.102",
  // apiUrl: "http://192.168.150.101",
  // apiUrl: "http://192.168.0.103",
  // apiUrl: "http://192.168.1.103",
  // apiUrl: "http://192.168.101.13",
  // apiUrl: "http://192.168.101.11",
  // apiUrl: "http://192.168.137.220",
  // apiUrl: "http://192.168.190.172",
  // apiUrl: "http://192.168.43.35",
  // apiUrl: "http://localhost",
  individualName: "individual",
  companyName: "company",
  applicationStatuses: {  
    applied: "applied",
    interviewed: "interviewed",
    withdrawn: "withdrawn",
    declined: "declined",
    assigned: "assigned",
    completed: "completed",
    discontinued: "discontinued",
    shortlisted: "shortlisted",
  },
  sectionNames: {
    HIRE_APPLIED_SECTION: 'hire/applied',
    HIRE_HIRED_SECTION: 'hire/hired',
    WORK_APPLIED_SECTION: 'work/applied',
    WORK_HIRED_SECTION: 'work/hired'
  },
  ratingStatuses: {
    pending: "pending",
    rated: "rated",
  },
  reviewStatuses: {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
  },
  maxImageUpload: 1,
  pusher: {
    secret: "04ee7365497e404fdd5d",
    key: "4572521f736b7ce98cfd",
    cluster: "ap2",
  },
  firebase: {
    apiKey: "AIzaSyAF7xXowCzmvTe2e06BT0fV4-JhfZ6ahes",
    authDomain: "yaywerk.firebaseapp.com",
    databaseURL: "https://yaywerk.firebaseio.com",
    projectId: "yaywerk",
    storageBucket: "yaywerk.appspot.com",
    messagingSenderId: "526256010844",
    appId: "1:526256010844:web:18cc31b56ecd2b5114d899",
    measurementId: "G-94MK1Y5519",
  },
};

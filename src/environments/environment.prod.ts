export const environment = {
  production: true,
  apiUrl: "https://prodbackend.yaywerk.com",
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

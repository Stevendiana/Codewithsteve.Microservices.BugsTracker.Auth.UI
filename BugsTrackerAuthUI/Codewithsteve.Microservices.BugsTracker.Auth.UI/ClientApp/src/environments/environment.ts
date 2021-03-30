// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  scope: ["api://e47dcf28-1a7e-4f83-b48c-0c48f934d4e0/access_as_user"],
  bugApi: "http://bugsapi.uksouth.cloudapp.azure.com/",
  roles: {
    "Admin": "Admin",
    "ReadOnly": "ReadOnly"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

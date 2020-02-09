# interceptorModule
A module for AngularJS that allows to catch HTML responses and show messages according to the status code and the target url.

# How to use

**You need:**
  - AngularJS
  - Angular Material (the module use $mdDialog to show messages)
  - Loader
  
**Steps:**
  - Add interceptor.module.js to your index.html
  - Inject "interceptorModule" in your main module
  - Add the following lines to your main module:
    ```javascript
    app.factory('resourceInterceptor', ['$rootScope', function ($rootScope) {
      return {
          response: function (response) {
              $rootScope.$broadcast('showMessage', response);
              return response;
          },
          responseError: function (response) {
              $rootScope.$broadcast('showMessage', response);
              return response;
          }
      }
    }]);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('resourceInterceptor');
    }]);
    ```
  - Add the loader you want. A div tag with id="loader" is needed. I'm using one from this page: https://icons8.com/cssload
  
# What I learned
  - HTTP Status codes
  - Catch HTTP response data
  - Using promises
  - Showing messages using a dialog

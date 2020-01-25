//Receive the event emitted by the request interceptor and
//display the corresponding messages if necessary

angular
    .module('interceptorModule')
    .service('messages', ['$mdDialog', '$rootScope', '$route', '$location', '$window', '$loader', function ($mdDialog, $rootScope, $route, $location, $window, $loader) {
        var self = this;

        var baseUrl = ''; //base url of API
        var loginUrl = '';
        var title = '';
        var content = '';
        var msgOk = '';

        var emptyFunction = function () { };
        var onSuccess = emptyFunction;
        var onError = emptyFunction;

        self.showDialog = function () {
            var dialog = $mdDialog.alert()
                .title(title)
                .textContent(content)
                .ariaLabel('Message')
                .ok(msgOk)

            $mdDialog.show(dialog).then(
                function () {
                    onSuccess();
                },
                function () {
                    onError();
                });
        };

        $rootScope.$on('showMessage', function (event, data) {
            //check default values. API returns default value when is null in the database (own rule)
            var isDefaultValue = function (value) {
                var result = false;

                if (value != undefined && value != null) {
                    var valueString = value.toString();
                    var defaultValues = [
                        '',
                        '-2147483648',
                        '-9223372036854776000',
                        '-7.922816251426434e+28',
                        '0001-01-01T00:00:00'
                    ];

                    if (defaultValues.indexOf(valueString) != -1) {
                        result = true;
                    }
                }

                return result;
            };

            var noDialog = false;
            var noDialog = data.config && data.config.noDialog ? data.config.noDialog : false;

            //set to undefined default values in JSON response
            var defaultToUndefined = function (object) {
                if (object != undefined) {
                    for (var propiedad in object) {
                        if (object[propiedad] != undefined
                            && typeof (object[propiedad]) != 'object'
                            && object.hasOwnProperty(propiedad)
                            && (isDefaultValue(object[propiedad]) || object[propiedad] == null)) {
                            object[propiedad] = undefined;
                        }
                        else if (typeof (object[propiedad]) == 'object' && propiedad != '$promise' && propiedad != '$resolved')
                            defaultToUndefined(object[propiedad]);
                    }
                }

                return object;
            };

            var url = data.config.url.toString(); //url to which the request was made

            switch (data.status) {
                case 200:
                    if (data.config.method == 'PUT') {
                        var newPage = ''; //example '/Home'

                        if (url.includes('')) { //add API method

                        }
                        else if (url.includes('')) { //different API method
                            newPage = '';

                            //redirect without showing a message
                            $location.url($location.path());
                            $location.path(newPage);
                        };
                    } else if (data.config.method == 'GET') {
                        if (url.includes('')) {
                            title = '';
                            content = '';
                            msgOk = ''; //message to show in the button ok
                            onSuccess = function () {
                                $route.reload();
                            };

                            onError = emptyFunction;
                            self.showDialog();
                        };

                        if (typeof data == 'object')
                            defaultToUndefined(data);
                        else if (typeof data == 'array');

                        for (var i = 0; i < data.length; i++) {
                            defaultToUndefined(data[i]);
                        }
                    } else if (data.config.method == 'DELETE') {

                    };

                    break;
                case 201:
                    if (url.includes('')) {
                        $route.reload(); //just reloads the current page
                    };
                    break;
                case 400:
                    title = data.data;
                    content = '';
                    msgOk = '';
                    onSuccess = emptyFunction;
                    onError = emptyFunction;

                    $loader.hide();

                    self.showDialog();
                    break;
                case 401:
                    //unauthorized
                    $window.location.href = loginUrl;

                    break;
                case 403:
                    title = 'Forbidden';
                    content = '';
                    msgOk = '';
                    onSuccess = function () {
                        $location.url($location.path());
                        $location.path('');
                    };
                    onError = emptyFunction;

                    $loader.hide();

                    self.showDialog();
                    break;
                case 404:

                    break;
                case 500:
                    title = 'Internal Server Error';
                    content = '';
                    msgOk = '';
                    onSuccess = emptyFunction;
                    onError = emptyFunction;

                    $loader.hide();

                    self.showDialog();
                    break;
                default:
                    title = 'Error';
                    content = '';
                    msgOk = '';
                    onSuccess = emptyFunction;
                    onError = emptyFunction;

                    $loader.hide();

                    self.showDialog();
                    break;
            }
        });
    }])

    .service('$loader', ['$document', '$q',
        function ($document, $q) {
            return {
                showUntil(promises, doWhenFinishAll) {
                    var loader = angular.element($document[0].querySelector('div#loader'));
                    loader[0].style.display = 'block';

                    $q.all(promises)
                        .then((data) => {
                            loader[0].style.display = 'none';
                            doWhenFinishAll(data);
                        });
                },
                show() {
                    var loader = angular.element($document[0].querySelector('div#loader'));
                    loader[0].style.display = 'block';
                },
                hide() {
                    var loader = angular.element($document[0].querySelector('div#loader'));
                    loader[0].style.display = 'none';
                }
            }
        }]);
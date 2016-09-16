// ReSharper disable once InconsistentNaming
module app.core {
     //Thanks to http://codetunnel.io/how-to-do-loading-spinners-the-angular-way/
    "use strict";

    interface ISpinnerBindings {
        name: string;
        group: string;
        onLoaded: (param: any) => any;
        onShow: (param: any) => any;
        onHide: (param: any) => any;
        show: boolean;
    }

    interface ISpinnerController extends ISpinnerBindings {
        api: any;
    };

    class SpinnerController implements ISpinnerController {

        name: string;
        group: string;
        show: boolean;
        imgsrc: string;
        register: boolean;
        onLoaded: (param: any) => any;
        onShow: (param: any) => any;
        onHide: (param: any) => any;
        api: any;
        spinnerService: ISpinnerService;

        static $inject = ['spinner.service'];

        constructor(spinnerService) {
            this.spinnerService = spinnerService;
        }

        $onInit() {

            var that = this;
            // register should be true by default if not specified.
            if (!this.hasOwnProperty("register")) {
                this.register = true;
            } else {
                this.register = !!this.register;
            }
            // Declare a mini-API to hand off to our service so the 
            // service doesn't have a direct reference to this
            // directive's scope.
            this.api = {
                name: this.name,
                group: this.group,
                show() {
                    that.show = true;
                },
                hide() {
                    that.show = false;
                },
                toggle() {
                    that.show = !that.show;
                }
            };

            // Register this spinner with the spinner service.
            if (this.register) {
                this.spinnerService.register(this.api);
            }

            // This spinner is good to go.
            // Fire the onLoaded expression if provided.
            if (this.onLoaded) {
                this.onLoaded({
                    spinnerService: this.spinnerService,
                    spinnerApi: this.api
                });
            }

        }

        // If an onShow or onHide expression was provided,
        // register a watcher that will fire the relevant
        // expression when show's value changes
        $onChanges(changes) {
            if (changes.show && this.onShow) {
                this.onShow({
                    spinnerService: this.spinnerService,
                    spinnerApi: this.api
                });
            }
            if (changes.show && this.onHide) {
                this.onHide({
                    spinnerService: this.spinnerService,
                    spinnerApi: this.api
                });
            }
        };

    }

    class SpinnerComponent implements ng.IComponentOptions {

        bindings: any;
        controller: any;
        template: string;
        controllerAs: string;
        transclude: boolean;


        constructor() {
            this.template = [
                '<span ng-show="vm.show">',
                '  <img ng-show="vm.imgSrc" ng-src="{{vm.imgSrc}}" />',
                "  <span ng-transclude></span>",
                "</span>"
            ].join("");
            this.controllerAs = "vm";
            this.controller = SpinnerController;
            this.transclude = true;
            this.bindings = {
                name: "@?",
                group: "@?",
                show: "<?",
                imgSrc: "@?",
                register: "@?",
                onLoaded: "&?",
                onShow: "&?",
                onHide: "&?"
            };
        }
    }

    angular.module("app.core").component("spinner", new SpinnerComponent());
}
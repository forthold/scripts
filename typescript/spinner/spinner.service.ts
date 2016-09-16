// ReSharper disable once InconsistentNaming
module app.core {
    "use strict";

    export interface ISpinnerService {
        register(data);
        unregister(name);
        unregisterGroup(group);
        unregisterAll();
        show(name: string);
        hide(name);
        showGroup(group);
        hideGroup(group);
        showAll();
        hideAll();
    }

    export class SpinnerService implements ISpinnerService {

        private spinners = {};

        // private method for spinner registration.
        register(data:any) {
            if (!data.hasOwnProperty("name")) {
                throw new Error("Spinner must specify a name when registering with the spinner service.");
            }
            if (this.spinners.hasOwnProperty(data.name)) {
                throw new Error(`A spinner with the name '${data.name}' has already been registered.`);
            }
            this.spinners[data.name] = data;
        }

        // unused private method for unregistering a directive,
        // for convenience just in case.
        unregister(name) {
            if (this.spinners.hasOwnProperty(name)) {
                delete this.spinners[name];
            }
        }

        unregisterGroup(group) {
            for (let name in this.spinners) {
                if (this.spinners.hasOwnProperty(name)) {
                    if (this.spinners[name].group === group) {
                        delete this.spinners[name];
                    }
                }
            }
        }

        unregisterAll() {
            for (let name in this.spinners) {
                if (this.spinners.hasOwnProperty(name)) {
                    delete this.spinners[name];
                }
            }
        }

        show(name) {
            const spinner = this.spinners[name];
            if (!spinner) {
                throw new Error(`No spinner named '${name}' is registered.`);
            }
            spinner.show();
        }

        hide(name) {
            const spinner = this.spinners[name];
            if (!spinner) {
                throw new Error(`No spinner named '${name}' is registered.`);
            }
            spinner.hide();
        }

        showGroup(group) {
            let groupExists = false;
            for (let name in this.spinners) {
                if (this.spinners.hasOwnProperty(name)) {
                    const spinner = this.spinners[name];
                    if (spinner.group === group) {
                        spinner.show();
                        groupExists = true;
                    }
                }
            }
            if (!groupExists) {
                throw new Error(`No this.spinners found with group '${group}'.`);
            }
        }

        hideGroup(group) {
            let groupExists = false;
            for (let name in this.spinners) {
                if (this.spinners.hasOwnProperty(name)) {
                    const spinner = this.spinners[name];
                    if (spinner.group === group) {
                        spinner.hide();
                        groupExists = true;
                    }
                }
            }
            if (!groupExists) {
                throw new Error(`No this.spinners found with group '${group}'.`);
            }
        }

        showAll() {
            for (let name in this.spinners) {
                if (this.spinners.hasOwnProperty(name)) {
                    this.spinners[name].show();
                }
            }
        }

        hideAll() {
            for (let name in this.spinners) {
                if (this.spinners.hasOwnProperty(name)) {
                    this.spinners[name].hide();
                }
            }
        }
    }

    angular.module("app.core").service("spinner.service", [SpinnerService]);
}
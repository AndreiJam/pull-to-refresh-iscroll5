angular.module('iscroll').service("$iScroll", function () {

    /**
     *
     * @type {bmb.core.model.BaseModel}
     */
    var self = this;

    /**
     *
     * @type {{}}
     */
    this.iscrolls = {};

    /**
     *
     * @type {{}}
     */
    this.handlers = {};

    var runHandlers = function(event, name) {
        angular.forEach(self.handlers[name][event], function (handler) {
            handler(self.iscrolls[name]);
        });
    };

    /**
     * Trigger event handler on the model.
     *
     * @expose
     * @public
     * @param {string} event
     * @param {string} name of iscroll
     * @return {void}
     */
    this.triggerHandler = function (event, name) {
        if (self.iscrolls[name] && self.handlers[name][event]) {
            runHandlers(event, name);
        }
    };

    /**
     * Registering the event handler on model.
     *
     * @expose
     * @public
     * @param {string} event event type
     * @param {function()} fn callback function
     * @param {string} name of iscroll
     * @return {void}
     */
    this.on = function (event, fn, name) {
        if (name && event) {
            if (!self.handlers[name]) {
                self.handlers[name] = {};
            }
            if (!self.handlers[name][event]) {
                self.handlers[name][event] = []
            }
            self.handlers[name][event].push(fn);
        }
    };

    /**
     * TODO Replace with some Observer pattern impl lib.
     * Unregistering the event handler on model.
     *
     * @expose
     * @public
     * @param {string} event event type
     * @param {function()} fn callback function
     * @param {string} name of iscroll
     */
    this.off = function (event, fn, name) {
        if (name && event) {
            if (self.handlers[name]) {
                self.handlers[name][event].remove(fn);
            }
        }
    };

    this.set = function (name, iscroll) {
        if (self.iscrolls[name]) {
            throw "IScroll with provided name: '" + name + "' already exists, please use different name.";
        }
        self.iscrolls[name] = iscroll;
        self.triggerHandler('ready', name);
    };

    this.get = function (name) {
        if (name) {
            if (name in self.iscrolls) {
                return self.iscrolls[name];
            } else {
                throw "IScroll with provided name: '" + name + "' already exists, please use different name.";
            }
        } else {
            if (Object.keys(self.iscrolls).length == 1)
                return self.iscrolls[Object.keys(self.iscrolls)[0]];
            else if (Object.keys(self.iscrolls).length > 1) {
                throw "There are more than one iScroll object. Please, provide name to specify.";
            } else {
                throw "There is no any iScroll object created.";
            }
        }
    };
});
angular.module('iscroll').directive("iScroll", function ($iScroll) {
    return {
        "restrict": "AE",
        "link": function (scope, element, attrs) {
            var iScrollTimeout = 200;

            // default options
            var iScroll_opts = {
                probeType: 3,
                useTransition: true,
                scrollbars: true,
                click: true,
                fadeScrollbars: true,
                bindToWrapper: true
            };

            /** @type {string} */
            var name = attrs["name"] || attrs["iScroll"];

            if (!name) {
                throw "the name attribute of directive iScroll is required";
            }

            element.addClass(name);

            if (attrs.iscrollOptions) {
                for (var i in attrs.iscrollOptions) {
                    iScroll_opts[i] = attrs.iscrollOptions[i];
                }
            }

            var currentIScroll = null;
            var scroller = null;

            function setScroll() {
                //TODO: remove reference from window object
                currentIScroll = new IScroll(element[0], iScroll_opts);
                scroller = currentIScroll.indicators[0].scroller;
                if (attrs.offset) {
                    currentIScroll.offset = Number.parseInt(attrs.offset);
                }
                $iScroll.set(name, currentIScroll);
            }

            // pecific setting for setting timeout using: iscroll-delay='{val}'
            if (attrs.iscrollDelay !== undefined) {
                iScrollTimeout = attr.iscrollDelay;
            }

            setTimeout(function () {
                setScroll();
            }, iScrollTimeout);


            function refreshIScroll() {
                setTimeout(function () {
                    currentIScroll.refresh();
                }, iScrollTimeout);
            }

            scope.$on('$destroy', function () {
                if (currentIScroll) {
                    currentIScroll.destroy();
                    scroller = null;
                    currentIScroll = null;
                }
            });
        }
    }
});
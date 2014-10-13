angular.module('iscroll', [])
    .constant('pullToRefreshConfig', {
        threshold: 60,
        text: {
            pull: 'pull to refresh',
            release: 'release to refresh',
            loading: 'refreshing...'
        },
        icon: {
            pull: 'fa fa-arrow-down',
            release: 'fa fa-arrow-up',
            loading: 'fa fa-refresh fa-spin'
        }
    })
    .run([
        '$templateCache',
        function ($templateCache) {
            $templateCache.put('angular-pull-to-refresh.tpl.html', '<div class=\'pull-to-refresh\'>\n' + '  <i ng-class=\'icon[status]\'></i>&nbsp;\n' + '  <span ng-bind=\'text[status]\'></span>\n' + '</div>\n');
        }
    ])
    .directive('pullToRefresh', [
        '$compile',
        '$timeout',
        '$q',
        'pullToRefreshConfig',
        '$iScroll',
        function ($compile, $timeout, $q, pullToRefreshConfig, $iScroll) {
            return {
                restrict: 'A',
                templateUrl: 'angular-pull-to-refresh.tpl.html',
                link: function postLink(scope, iElement, iAttrs, teslaCtrl) {
                    /** @type {string} */
                    var name = iAttrs["name"];

                    if (!name) {
                        throw "the name attribute of directive tesla-pull-to-refresh is required";
                    }

                    var shouldReload = false;
                    var loading = false;
                    var setStatus = function (status) {
                        shouldReload = status === 'release';
                        loading = status === 'loading';
                        scope.$apply(function () {
                            scope.status = status;
                        });
                    };

                    var config = angular.extend({}, pullToRefreshConfig, iAttrs);

                    var icon = iElement.find('i')[0];
                    scope.text = config.text;
                    scope.icon = config.icon;
                    scope.status = 'pull';
                    function resetIcon() {
                        icon.style.webkitTransition = 'all 0.2s ease';
                        icon.style.webkitTransform = '';
                    }

                    $iScroll.on('ready', initPullToRefresh, name);

                    function initPullToRefresh(iScroll) {
                        var scrollWrapper = angular.element(iScroll.wrapper);
                        scrollWrapper.bind('touchmove', function () {
                            if (!loading) {
                                var top = -iScroll.y;

                                if (top < 0 && top >= -config.threshold) {
                                    icon.style.webkitTransition = '';
                                    icon.style.webkitTransform = 'rotate(' + top * 180 / config.threshold + 'deg)';
                                }
                                if (top < -config.threshold && !shouldReload) {
                                    setStatus('release');
                                    icon.style.webkitTransform = '';
                                } else if (top > -config.threshold && shouldReload) {
                                    setStatus('pull');
                                }
                            }
                        });
                        scrollWrapper.bind('touchend', function () {
                            if (!shouldReload || loading) {
                                resetIcon();
                                return;
                            }
                            setTimeout(function () {
                                iScroll.scrollTo(0, config.threshold - 20, iScroll.options.bounceTime + 100);
                                iScroll.disable();
                            });
                            setStatus('loading');
                            $q.when(scope.$eval(iAttrs.pullToRefresh)).then(function () {
                                $timeout(function () {
                                    icon.style.webkitTransform = '';
                                    iScroll.enable();
                                    iScroll.scrollTo(0, 0, 100);
                                    setStatus('pull');
                                }, iScroll.options.bounceTime + 100);
                            });
                        });

                        scope.$on('$destroy', function () {
                            scrollWrapper.unbind('touchmove');
                            scrollWrapper.unbind('touchend');
                            $iScroll.off('ready', initPullToRefresh, name);
                        });
                    }
                }
            }
        }
    ]);

/* 
The following code has parts from jqt.js under the MIT license.
*/
(function () {
    $.jQT = (function () {
        var $body,
            $currentPage,
            $head,
            customHistory,
            newPageCount,
            tapBuffer,
            touchSelectors;
        jQT.prototype.extensions = [];
        jQT.prototype.orientation = 'portrait';
        jQT.prototype.tapHandlers = [];
        jQT.prototype.defaults = {
            addGlossToIcon: true,
            backSelector: ".back",
            cacheGetRequests: true,
            fixedViewport: true,
            formSelector: "form",
            fullScreen: true,
            fullScreenClass: "fullscreen",
            icon: null,
            icon4: null,
            minimalUIViewport: true,
            preloadImages: false,
            starter: $(document).ready,
            startupScreen: null,
            statusBar: "default",
            submitSelector: ".submit",
            touchSelector: "a, .touch",
            updateHash: true,
            useFastTouch: true,
            useTouchScroll: true
        };
        jQT.addExtension = function (extension) {
            return this
                .prototype
                .extensions
                .push(extension)
        };
        $body = void 0;
        $head = $("head");
        customHistory = [];
        newPageCount = 0;
        $currentPage = "";
        touchSelectors = [];
        tapBuffer = 100;
        function jQT(options) {
            var addPageToHistory,
                clickHandler,
                doNavigation,
                hashChangeHandler,
                initHairExtensions,
                insertPages,
                isExternalLink,
                orientationChangeHandler,
                setHash,
                showPageByHref,
                start,
                submitHandler,
                submitParentForm,
                support,
                tapHandler,
                touchStartHandler;
            this.tapHandlers = this
                .tapHandlers
                .concat([
                    {
                        name: "external-link",
                        isSupported: function (e, params) {
                            return isExternalLink(params.$el)
                        }
                    }, {
                        name: "back-selector",
                        isSupported: (function (_this) {
                            return function (e, params) {
                                return params
                                    .$el
                                    .is(_this.settings.backSelector)
                            }
                        })(this),
                        fn: (function (_this) {
                            return function (e, params) {
                                _this.goBack(params.hash);
                                return false
                            }
                        })(this)
                    }, {
                        name: "submit-selector",
                        isSupported: (function (_this) {
                            return function (e, params) {
                                return params
                                    .$el
                                    .is(_this.settings.submitSelector)
                            }
                        })(this),
                        fn: function (e, params) {
                            submitParentForm(params.$el)
                        }
                    }, {
                        name: "webapp",
                        isSupported: function (e, params) {
                            return params.target === "_webapp"
                        },
                        fn: function (e, params) {
                            window.location = params.href;
                            return false
                        }
                    }, {
                        name: "no-op",
                        isSupported: function (e, params) {
                            return params.href === "#"
                        },
                        fn: function (e, params) {
                            params
                                .$el
                                .removeClass('active');
                            return true
                        }
                    }, {
                        name: "standard",
                        isSupported: function (e, params) {
                            return params.hash && params.hash !== "#"
                        },
                        fn: (function (_this) {
                            return function (e, params) {
                                params
                                    .$el
                                    .addClass("active");
                                _this.goTo($(params.hash).data("referrer", params.$el), params.$el.hasClass("reverse"));
                                return false
                            }
                        })(this)
                    }, {
                        name: "external",
                        isSupported: function (e, params) {
                            return true
                        },
                        fn: function (e, params) {
                            params
                                .$el
                                .addClass("loading active");
                            showPageByHref(params.$el.attr("href"), {
                                callback: function () {
                                    params
                                        .$el
                                        .removeClass("loading");
                                    return setTimeout(function () {
                                        return params
                                            .$el
                                            .removeClass('active')
                                    }, 250)
                                },
                                $referrer: params.$el
                            });
                            return false
                        }
                    }
                ]);
            this.goTo = (function (_this) {
                return function (toPage) {
                    var fromPage,
                        nextPage,
                        _i,
                        _len;
                    fromPage = customHistory[0].page;
                    if (typeof toPage === "string") {
                        nextPage = $(toPage);
                        if (!nextPage.length) {
                            showPageByHref(toPage);
                            return
                        } else {
                            toPage = nextPage
                        }
                    }
                    if (doNavigation(fromPage, toPage)) {
                        _this
                    } else {
                        console.warn("Could not animate pages.");
                        return false
                    }
                }
            })(this);
            this.goBack = (function (_this) {
                return function (toPage) {
                    var end,
                        from,
                        h,
                        i,
                        to,
                        _i,
                        _len;
                    if (customHistory.length < 1) {
                        console.warn("History is empty.")
                    }
                    if (customHistory.length === 1) {
                        console.warn("You are on the first panel.");
                        window
                            .history
                            .go(-1)
                    }
                    if (typeof toPage === 'number') {
                        if (toPage > 0) {
                            customHistory.splice(1, toPage)
                        } else if (toPage < 0) {
                            customHistory.splice(1, customHistory.length + toPage - 1)
                        }
                    } else if (/^#.+/.test(toPage)) {
                        end = 0;
                        for (i = _i = 0, _len = customHistory.length; _i < _len; i = ++_i) {
                            h = customHistory[i];
                            if (h.hash === toPage) {
                                end = i;
                                break
                            }
                        }
                        customHistory.splice(1, end - 1)
                    }
                    from = customHistory[0];
                    to = customHistory[1];
                    if (!((from != null) && (to != null))) {
                        return
                    }
                    if (doNavigation(from.page, to.page, true)) {
                        _this
                    } else {
                        console.warn("Could not go back.");
                        return false
                    }
                }
            })(this);
            this.history = customHistory;
            insertPages = (function (_this) {
                return function (nodes) {
                    var targetPage;
                    targetPage = null;
                    $(nodes).each(function (index, node) {
                        var $node;
                        $node = $(this);
                        if (!$node.attr("id")) {
                            $node.attr("id", "page-" + (newPageCount += 1))
                        }
                        $("#" + $node.attr("id")).remove();
                        $body.append($node);
                        $body.trigger("pageInserted", {page: $node});
                        if ($node.hasClass("current") || !targetPage) {
                            return targetPage = $node
                        }
                    });
                    if (targetPage != null) {
                        _this.goTo(targetPage);
                        targetPage
                    } else {
                        return false
                    }
                }
            })(this);
            addPageToHistory = function (page) {
                var id;
                id = page.attr('id');
                return customHistory.unshift({
                    page: page,
                    hash: "#" + id,
                    id: id
                })
            };
            clickHandler = (function (_this) {
                return function (e) {
                    var $el;
                    $el = $(e.target);
                    if (!$el.is(touchSelectors.join(", "))) {
                        $el = $el.closest(touchSelectors.join(", "))
                    }
                    if ($el && $el.attr("href") && !isExternalLink($el)) {
                        console.warn("Need to prevent default click behavior.");
                        e.preventDefault()
                    } else {
                        console.warn("No need to prevent default click behavior.")
                    }
                    if (!support.touch) {
                        console.warn("Converting click event to a tap event because touch handlers are not present or " +
                                "off.");
                        $(e.target).trigger("tap", e)
                    }
                }
            })(this);
            hashChangeHandler = (function (_this) {
                return function (e) {
                    if (location.hash === customHistory[0].hash) {
                        console.log("We are on the right panel.");
                        return true
                    } else if (location.hash === "") {
                        _this.goBack();
                        return true
                    } else if (customHistory[1] && location.hash === customHistory[1].hash) {
                        _this.goBack();
                        return true
                    } else {
                        console.warn("Could not find ID in history, just forwarding to DOM element.");
                        _this.goTo($(location.hash))
                    }
                }
            })(this);
            isExternalLink = function ($el) {
                return $el.attr("target") === "_blank" || $el.attr("rel") === "external" || $el.is("a[href^=\"http://maps.google.com\"], a[href^=\"mailto:\"], a[href^=\"tel:\"], a[" +
                        "href^=\"javascript:\"], a[href*=\"youtube.com/v\"], a[href*=\"youtube.com/watch" +
                        "\"]")
            };
            showPageByHref = (function (_this) {
                return function (href, options) {
                    options = $.extend({}, {
                        data: null,
                        method: "GET",
                        $referrer: null
                    }, options);
                    if (href.charAt(0) !== '#') {
                        return $.ajax({
                            url: href,
                            data: options.data,
                            type: options.method,
                            success: function (data) {
                                var firstPage;
                                firstPage = insertPages(data);
                                if (firstPage) {
                                    if (options.method === "GET" && _this.settings.cacheGetRequests === true && options.$referrer) {
                                        return options
                                            .$referrer
                                            .attr("href", "#" + firstPage.attr("id"))
                                    }
                                }
                            },
                            error: function (data) {
                                if (options.$referrer) {
                                    return options
                                        .$referrer
                                        .removeClass('active')
                                }
                            }
                        })
                    } else {
                        if (options.$referrer) {
                            return options
                                .$referrer
                                .removeClass('active')
                        }
                    }
                }
            })(this);
            support = void 0;
            start = (function (_this) {
                return function () {
                    var $touchSelectors,
                        anatomyLessons,
                        extFn,
                        startHash,
                        _i,
                        _len,
                        _ref;
                    support = $.support || {};
                    $.extend(support, {
                        touch: (typeof window.TouchEvent !== "undefined") && (window.navigator.userAgent.indexOf("Mobile") > -1) && _this.settings.useFastTouch
                    });
                    if (!support.touch) {
                        console.warn("This device does not support touch interaction, or it has been deactivated by th" +
                                "e developer. Some features might be unavailable.")
                    }
                    _ref = _this.extensions;
                    for (_i = 0, _len = _ref.length; _i < _len; _i += 1) {
                        extFn = _ref[_i];
                        if ($.isFunction(extFn)) {
                            $.extend(_this, extFn(_this))
                        }
                    }
                    touchSelectors.push(_this.settings.touchSelector.concat(_this.settings.backSelector, _this.settings.submitSelector));
                    $touchSelectors = $(touchSelectors.join(', ')).css('-webkit-touch-callout', 'none');
                    $body = $("#jqt");
                    anatomyLessons = [];
                    if (!$body.length) {
                        console.warn("Could not find an element with the id “jqt”, so the body id has been set to \"jq" +
                                "t\". If you are having any problems, wrapping your panels in a div with the id “" +
                                "jqt” might help.");
                        $body = $(document.body).attr("id", "jqt")
                    }
                    if (support.transform3d) {
                        anatomyLessons.push("supports3d")
                    }
                    anatomyLessons.push(_this.settings.useTouchScroll
                        ? 'touchscroll'
                        : 'autoscroll');
                    if (_this.settings.fullScreenClass && window.navigator.standalone) {
                        anatomyLessons.push(_this.settings.fullScreenClass, _this.settings.statusBar)
                    }
                    $body
                        .addClass(anatomyLessons.join(" "))
                        .on("click", clickHandler)
                        .on("orientationchange", orientationChangeHandler)
                        .on("submit", submitHandler)
                        .on("tap", tapHandler)
                        .on((support.touch
                            ? "touchstart"
                            : "mousedown"), touchStartHandler)
                        .trigger("orientationchange");
                    if (_this.settings.updateHash) {
                        $(window).on("hashchange", hashChangeHandler)
                    }
                    startHash = location.hash;
                    if (!$("#jqt > .current").length) {
                        $currentPage = $("#jqt > *:first-child").addClass("current")
                    } else {
                        $currentPage = $("#jqt > .current")
                    }
                    setHash($currentPage.attr("id"));
                    addPageToHistory($currentPage);
                    if (_this.settings.updateHash && $(startHash).length) {
                        return _this.goTo(startHash)
                    }
                }
            })(this);
            orientationChangeHandler = function () {
                var orientation;
                scrollTo(0, 0);
                orientation = (Math.abs(window.orientation) === 90
                    ? "landscape"
                    : "portrait");
                return $body
                    .removeClass("portrait landscape")
                    .addClass(orientation)
                    .trigger("turn", {orientation: orientation})
            };
            setHash = (function (_this) {
                return function (hash) {
                    if (_this.settings.updateHash) {
                        return location.hash = "#" + hash.replace(/^#/, "")
                    }
                }
            })(this);
            submitHandler = (function (_this) {
                return function (e, callback) {
                    var $form;
                    $(":focus").trigger("blur");
                    $form = (typeof e === "string"
                        ? $(e).eq(0)
                        : (e.target
                            ? $(e.target)
                            : $(e)));
                    if ($form.length && $form.is(_this.settings.formSelector) && $form.attr("action")) {
                        e.preventDefault();
                        return showPageByHref($form.attr("action"), {
                            data: $form.serialize(),
                            method: $form.attr("method") || "POST",
                            callback: callback
                        })
                    }
                }
            })(this);
            submitParentForm = function ($el) {
                var $form;
                $form = $el.closest("form");
                if ($form.length) {
                    console.warn("About to submit parent form.");
                    $form.trigger("submit");
                    return false
                } else {
                    console.warn("No parent form found.");
                    return true
                }
            };
            tapHandler = (function (_this) {
                return function (e) {
                    var $el,
                        flag,
                        handler,
                        hash,
                        href,
                        params,
                        selectors,
                        target,
                        _i,
                        _len,
                        _ref;
                    if (e.isDefaultPrevented()) {
                        return true
                    }
                    $el = $(e.target);
                    selectors = touchSelectors.join(',');
                    if (!$el.is(selectors)) {
                        $el = $el.closest(selectors)
                    }
                    if (!$el.length || !$el.attr("href")) {
                        console.warn("Could not find a link related to tapped element.");
                        return true
                    }
                    target = $el.attr("target");
                    hash = $el.prop("hash");
                    href = $el.attr("href");
                    params = {
                        e: e,
                        $el: $el,
                        target: target,
                        hash: hash,
                        href: href
                    };
                    _ref = _this.tapHandlers;
                    for (_i = 0, _len = _ref.length; _i < _len; _i += 1) {
                        handler = _ref[_i];
                        if (handler.isSupported(e, params)) {
                            return flag = handler.fn(e, params)
                        }
                    }
                }
            })(this);
            touchStartHandler = function (e) {
                var $el,
                    selectors;
                $el = $(e.target);
                selectors = touchSelectors.join(", ");
                if (!$el.is(selectors)) {
                    $el = $el.closest(selectors)
                }
                if ($el.length && $el.attr("href")) {
                    $el.addClass("active")
                }
                $el
                    .on((support.touch
                        ? "touchmove"
                        : "mousemove"), function () {
                        return $el.removeClass("active")
                    });
                return $el.on("touchend", function () {
                    $el.off("touchend mouseup");
                    return $el.off("touchmove mousemove")
                })
            };
            doNavigation = (function (_this) {
                return function (fromPage, toPage, goingBack) {
                    var navigationEndHandler;
                    if (goingBack == null) {
                        goingBack = false
                    }
                    navigationEndHandler = function (event) {
                        setTimeout(function () {
                            toPage.removeClass('in');
                            return window.scroll(0, 0)
                        }, tapBuffer);
                        fromPage
                            .find('.active')
                            .removeClass('active');
                    };
                    if (!toPage.length) {
                        $('.active').removeClass('active');
                        console.warn("Target element is missing.");
                        return false
                    }
                    if (toPage.hasClass("current")) {
                        $('.active').removeClass('active');
                        console.warn("You are already on the page you are trying to navigate to.");
                        return false
                    }
                    $(":focus").trigger("blur");
                        toPage.addClass("current in");
                        fromPage.removeClass("current");
                        navigationEndHandler()
                    
                    $currentPage = toPage;
                    if (goingBack) {
                        customHistory.shift()
                    } else {
                        addPageToHistory($currentPage)
                    }
                    setHash($currentPage.attr("id"));
                    return true
                }
            })(this);
            this.settings = $.extend({}, this.defaults, options);
            this
                .settings
                .starter(start)
        }
        return jQT
    })();
}).call(this);

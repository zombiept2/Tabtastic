(function($) {

    //tabs array
    var arrTabs = [];
    var tabtasticid = '';

    var methods = {
        init: function(options) {
            var defaults = {
                width: '100%',
                height: '100%',
                iframeWidth: '100%'
            };
            var options = $.extend(defaults, options);

            obj = $(this);
            tabtasticid = obj.attr('id');

            options.height = $(document).height() - 100;
            obj.css('position', 'relative');
            obj.css('width', options.width);
            obj.css('height', options.height);
            //tabs container
            obj.append("<div class='tabtastic-tabs'><ul class='tabtastic-sortable'></ul></div>");
            //frames container
            obj.append("<div class='tabtastic-frames' style='clear:both;'></div>");
            //add bind event
            $(window).bind('resize', function() {
                methods.resize(obj);
            });
        },
        createLinks: function() {
            $('a.tabtastic').each(function() {
                var title = $(this).attr('title');
                var url = $(this).attr('href');
                var uniquetabid = $(this).attr('uniquetabid');
                var unique = false;
                if ($(this).hasClass('unique-tab')) {
                    unique = true;
                }
                var addtab = "javascript:$('#tabtastic').tabtastic('add',{ title: '" + title + "', src: '" + url + "', unique: '" + unique + "', uniquetabid: '" + uniquetabid + "' });"
                $(this).attr('href', addtab);
            });
        },
        createInternalLinks: function() {
            $('a.tabtastic').each(function() {
                var title = $(this).attr('title');
                var url = $(this).attr('href');
                var uniquetabid = $(this).attr('uniquetabid');
                var unique = false;
                if ($(this).hasClass('unique-tab')) {
                    unique = true;
                }
                var addtab = "javascript:parent.$('#tabtastic').tabtastic('add',{ title: '" + title + "', src: '" + url + "', unique: '" + unique + "', uniquetabid: '" + uniquetabid + "' });"
                $(this).attr('href', addtab);
            });
        },
        add: function(options) {
            obj = $(this);
            var nextid = arrTabs.length;
            var newid = methods.generateGUID();
            tabContainer = $(this).find('.tabtastic-tabs ul');
            //hide all other iframes
            $(this).find('.tabtastic-frames-frame').each(function() {
                $(this).hide();
            });
            var found = false;
            var tab = {};
            if (options.unique == "true") {
                //try to find an existing tab
                tab = methods.findUnique(options.uniquetabid);
                if (tab) {
                    found = true;
                }
            }
            if (found == true) {
                methods.select(tab.id, true);
            }
            else {
                //add tab
                var select = "javascript:$('#" + obj.attr('id') + "').tabtastic('select','" + newid + "');";
                var closer = "javascript:$('#" + obj.attr('id') + "').tabtastic('remove','" + newid + "');";
                var newtab = "<li class='tabtastic-tabs-item' id='tabItem" + newid + "' tabid='" + newid + "'><div><a class='tab-link'>" + options.title;
                newtab = newtab + "</a></div>"
                if (options.sticky != "true") {
                    newtab = newtab + "<div class='tabtastic-closer'><a></a></div>";
                }
                newtab = newtab + "</li>";
                tabContainer.append(newtab);
                tabContainer.find('#tabItem' + newid).find('.tab-link').attr('href', select);
                tabContainer.find('#tabItem' + newid).find('.tabtastic-closer').find('a').attr('href', closer);
                frameContainer = obj.find('.tabtastic-frames');
                var ifcHeight = methods.getIframeHeight(obj);
                var resizer = "javascript:$('#" + obj.attr('id') + "').tabtastic('autoHeight', 'frame" + newid + "');";
                frameContainer.append('<div class="tabtastic-frames-frame" id="tabFrame' + newid + '"><iframe id="frame' + newid + '" onload="' + resizer + '" width="' + options.iframeWidth + '" height="' + ifcHeight + '" frameborder="0" src="' + options.src + '" /></div>');
                var tab = {
                    id: newid,
                    title: options.title,
                    uniquetabid: options.uniquetabid
                };
                arrTabs[nextid] = tab;
                methods.select(newid, false);
            }
        },
        autoHeight: function(id) {
            $('#' + id).height($('#' + id).contents().height());
        },
        select: function(id, refresh) {
            obj = $('#' + tabtasticid);
            //find tab
            //deactivate all others
            obj.find('.tabtastic-tabs-item-active').attr('class', 'tabtastic-tabs-item');
            obj.find('#tabItem' + id).each(function() {
                $(this).attr('class', 'tabtastic-tabs-item-active');
            });
            //hide all other iframes
            obj.find('.tabtastic-frames-frame').each(function() {
                $(this).hide();
            });
            //find iframe
            obj.find('#tabFrame' + id).each(function() {
                $(this).show();
            });
            if (refresh == true) {
                obj.find('#frame' + id).each(function() {
                    $(this).attr({
                        src: $(this).attr("src")
                    });
                });
            }
        },
        find: function(id) {
            var total = arrTabs.length;
            for (i = 0; i < total; i++) {
                if (arrTabs[i].id == id) {
                    return arrTabs[i];
                }
            }
        },
        findUnique: function(uniquetabid) {
            var total = arrTabs.length;
            for (i = 0; i < total; i++) {
                if (arrTabs[i].uniquetabid == uniquetabid) {
                    return arrTabs[i];
                }
            }
        },
        findArrayPosition: function(id) {
            var total = arrTabs.length;
            for (i = 0; i < total; i++) {
                if (arrTabs[i].id == id) {
                    return i;
                }
            }
        },
        findLastTab: function() {
            return $('.tabtastic-tabs-item:last').attr('tabid');
        },
        remove: function(id) {
            obj = $('#tabtastic');
            //find tab
            obj.find('#tabItem' + id).each(function() {
                //probably change it's look
                $(this).remove();
            });
            //find iframe
            obj.find('#tabFrame' + id).each(function() {
                $(this).remove();
            });
            //get this tab position in array
            var position = methods.findArrayPosition(id);
            //remove from array
            arrTabs.splice(position, 1);
            //get the last tab in the tab list
            var tabid = methods.findLastTab();
            methods.select(tabid, false);
        },
        resize: function(obj) {
            obj.find('iframe').attr('height', methods.getIframeHeight(obj));
            obj.find('iframe').css({ 'height': methods.getIframeHeight(obj) });
        },
        getIframeHeight: function(obj, start) {
            //get iframe container height
            var mainHeight = $(window).height() - 126; //obj.height();
            var subHeight = 0; //$(window).height() - 124;
//            if ($.browser.msie) {
//                subHeight = subHeight + 1;
//            }
            var ifcHeight = mainHeight - subHeight;
            return ifcHeight + 'px';
        },
        generateGUID: function() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            function guid() {
                return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
            }
            return guid();
        }
    }

    $.fn.tabtastic = function(method) {

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tabtastic');
        }

    }
})(jQuery);

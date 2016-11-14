(function(global) {
    var scriptName = "beacon.js"; //name of this script, used to get reference to own tag
    var jQuery; //noconflict reference to jquery
    var jqueryPath = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js";
    var jqueryVersion = "1.8.3";
    var scriptTag; //reference to the html script tag

    /******** Get reference to self (scriptTag) *********/
    var allScripts = document.getElementsByTagName('script');
    var targetScripts = [];
    for (var i in allScripts) {
        var name = allScripts[i].src
        if(name && name.indexOf(scriptName) > 0)
            targetScripts.push(allScripts[i]);
    }

    scriptTag = targetScripts[targetScripts.length - 1];

    /******** helper function to load external scripts *********/
    function loadScript(src, onLoad) {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", src);

        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    onLoad();
                }
            };
        } else {
            script_tag.onload = onLoad;
        }
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    }

    /******** helper function to load external css  *********/
    function loadCss(href) {
        var link_tag = document.createElement('link');
        link_tag.setAttribute("type", "text/css");
        link_tag.setAttribute("rel", "stylesheet");
        link_tag.setAttribute("href", href);
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(link_tag);
    }

    /******** load jquery into 'jQuery' variable then call main ********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== jqueryVersion) {
        loadScript(jqueryPath, initjQuery);
    } else {
        initjQuery();
    }

    function initjQuery() {
        jQuery = window.jQuery.noConflict(true);
        main();
    }

	/******** starting point for your widget ********/
	function main() {
		//your widget code goes here
		jQuery(document).ready(function ($) {
            var url      = window.location.href;     // Returns full URL
            var listener = "https://widget.commercialobserver.com/realgraph/listen?url=";
            listener += url;
			jQuery.getJSON(listener, function(result) {
          console.log('realgraph listener pinged');
			});

			//example load css
			//loadCss("http://example.com/widget.css");

			//example script load
			//loadScript("http://example.com/anotherscript.js", function() { /* loaded */ });
		});
    }
})(this);
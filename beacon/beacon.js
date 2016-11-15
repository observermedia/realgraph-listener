(function(global) {
    var scriptName = "beacon.js"; //name of this script, used to get reference to own tag
    var jQuery; //noconflict reference to jquery
    var jqueryPath = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js";
    var jqueryTemplatePath = "https://widget.commercialobserver.com/jquery.loadTemplate.js";
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
        loadScript(jqueryTemplatePath, function(){});
        main();
    }

    function renderBuildingsInfo(dataDiv, buildingsData){
      dataDiv.append('<h3 class="story-entity-cards-header">Buildings in this story</h3>');

      for(var i=0 ; i<buildingsData.length ; i++){

      }
    }

    function renderOrganizationsInfo(dataDiv){
      console.log('render organizations');
    }

    function renderPeopleInfo(dataDiv){
      console.log('render people');
    }

    function renderActivitiesInfo(dataDiv){
      console.log('render activities');
    }


    function renderEntitiesData(data) {
      var buildingsDataDiv = jQuery("div#realgraph-buildings-data");
      var organizationsDataDiv = jQuery("div#realgraph-organizations-data");
      var peopleDataDiv = jQuery("div#realgraph-people-data");
      var activitiesDataDiv = jQuery("div#realgraph-activities-data");

      if (data['buildings'].length > 0 && buildingsDataDiv > 0){
        // Add the header, then iterate over every building and add an html snippet displaying it.
        renderBuildingsInfo(buildingsDataDiv[0], data['buildings']);
      }

      if (data['organizations'].length > 0 && organizationsDataDiv > 0){
        renderOrganizationsInfo(organizationsDataDiv[0], data['organizations']);
      }

      if (data['people'].length > 0 && peopleDataDiv > 0){
        renderPeopleInfo(peopleDataDiv[0], data['people']);
      }

      if (data['activities'].length > 0 && activitiesDataDiv > 0){
        renderActivitiesInfo(activitiesDataDiv[0], data['activities']);
      }
    }

    function pingListener(currentURL) {
      var listener_ping_url = "https://widget.commercialobserver.com/realgraph/listen";
      var data = {
        url: currentURL
      };
      jQuery.getJSON(listener_ping_url, data, function(result){
        console.log('Realgraph listener pinged');
      });
    }

    function getEntitiesData(currentURL) {
      var url = "https://widget.commercialobserver.com/realgraph/entities_data";
      var data = {
        url: currentURL
      };
      jQuery.getJSON(url, data, function(result){
        console.log(result);
      })
    }

	/******** starting point for your widget ********/
	function main() {
		//your widget code goes here
		jQuery(document).ready(function ($) {
      var currentURL = window.location.href;     // Returns full URL
      pingListener(currentURL);
      getEntitiesData(currentURL);

			//example load css
			//loadCss("http://example.com/widget.css");

			//example script load
			//loadScript("http://example.com/anotherscript.js", function() { /* loaded */ });
		});
    }
})(this);
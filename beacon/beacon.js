(function(global) {
    var scriptName = "beacon.js"; //name of this script, used to get reference to own tag
    var jQuery; //noconflict reference to jquery
    var jqueryPath = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js";
    var jqueryTemplatePath = "https://widget.commercialobserver.com/jquery.loadTemplate.js";
    var buildingTemplatePath = "https://widget.commercialobserver.com/templates/building.html";
    var organizationTemplatePath = 'https://widget.commercialobserver.com/templates/organization.html';
    var personTemplatePath = 'https://widget.commercialobserver.com/templates/person.html';
    var activityTemplatePath = 'https://widget.commercialobserver.com/templates/activity.html';
    var jqueryVersion = "1.8.3";
    var scriptTag; //reference to the html script tag
    var entityCardTitleLength = 25;

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
        jQuery.getScript(jqueryTemplatePath, function(data, textStatus, jqxhr){
            console.log('jqueryTemplate has been loaded');
            main();
        });
    }

    function getMarginStyle(number) {
      if (number % 2 == 0){
        return "margin-right: 25px;";
      } else {
        return "";
      }
    }

    function shortenCardTitle(cardTitle, targetLength) {

      if (cardTitle.length <= targetLength){
        return cardTitle;
      }

      var titleFragments = cardTitle.split(' ');
      var result = titleFragments[0];
      var i = 1;

      while (result.length + titleFragments[i].length < targetLength) {
        result = result + ' ' + titleFragments[i];
        i++;

        if(i >= titleFragments.length) {
          break;
        }
      }

      // trim non-aphanumeric characters from the end of the result string
      while (!/^[a-z0-9]+$/i.test(result[result.length-1])) {
        result = result.substring(0, result.length - 1);
      }

      result = result + '...';

      return result;
    }

    function renderBuildingsInfo(dataDiv, buildingsData){
      dataDiv.append('<h3 class="story-entity-cards-header">Buildings in this story</h3>');

      for(var i=0 ; i<buildingsData.length ; i++){
        var data = buildingsData[i];

        var renderData = {
          buildingURL: data['url'],
          buildingName: shortenCardTitle(data['name'], entityCardTitleLength),
          address: data['address']
        };
        var new_div = jQuery('<div/>', {class: "xsmall-card building-card", style: getMarginStyle(i)});
        new_div.loadTemplate(buildingTemplatePath, renderData);
        dataDiv.append(new_div);
      }
    }

    function renderOrganizationsInfo(dataDiv, organizationsData){
      dataDiv.append('<h3 class="story-entity-cards-header">Organizations in this story</h3>');

      for(var i=0 ; i<organizationsData.length ; i++){
        var data = organizationsData[i];
        var org_types;

        if (data['types'].length == 0){
          org_types = 'Organization';
        } else {
          org_types = data['types'];
        }

        var renderData = {
          organizationURL: data['url'],
          organizationTypes: org_types,
          organizationName: shortenCardTitle(data['name'], entityCardTitleLength)
        };
        var new_div = jQuery('<div/>', {class: "xsmall-card organization-card", style: getMarginStyle(i)});
        new_div.loadTemplate(organizationTemplatePath, renderData);
        dataDiv.append(new_div);
      }

    }

    function renderPeopleInfo(dataDiv, peopleData){
      dataDiv.append('<h3 class="story-entity-cards-header">People in this story</h3>');

      for(var i=0 ; i<peopleData.length ; i++){
        var data = peopleData[i];

        var renderData = {
          personURL: data['url'],
          personAvatar: data['avatar'],
          personName: shortenCardTitle(data['name'], entityCardTitleLength),
          personHeadline: shortenCardTitle(data['headline'], 40)
        };
        var new_div = jQuery('<div/>', {class: "xsmall-card person-card", style: getMarginStyle(i)});
        new_div.loadTemplate(personTemplatePath, renderData);
        dataDiv.append(new_div);
      }

    }

    function renderActivitiesInfo(dataDiv, activitiesData){
      dataDiv.append('<h3 class="story-entity-cards-header">Activities / Transactions in this story</h3>');

      for(var i=0 ; i<activitiesData.length ; i++){
        var data = activitiesData[i];
        var activity_type = data['type'];
        var activity_type_class = activity_type.toLowerCase() + '-label';
        var activity_date_content = '&nbsp;&nbsp;&middot;&nbsp;&nbsp;' + data['date'];

        var renderData = {
          activityURL: data['url'],
          activityType: activity_type,
          activityTypeClass: activity_type_class,
          activityDateContent: activity_date_content,
          propertyName: shortenCardTitle(data['property_name'], entityCardTitleLength)
        };
        var new_div = jQuery('<div/>', {class: "xsmall-card activity-card", style: getMarginStyle(i)});
        new_div.loadTemplate(activityTemplatePath, renderData);
        dataDiv.append(new_div);
      }
    }

    function renderEntitiesData(data) {
      var buildingsDataDiv = jQuery("div#realgraph-buildings-data");
      var organizationsDataDiv = jQuery("div#realgraph-organizations-data");
      var peopleDataDiv = jQuery("div#realgraph-people-data");
      var activitiesDataDiv = jQuery("div#realgraph-activities-data");

      if (data['buildings'].length > 0 && buildingsDataDiv.length > 0){
        // Add the header, then iterate over every building and add an html snippet displaying it.
        renderBuildingsInfo(buildingsDataDiv, data['buildings']);
      } else {
        console.log('Not running buildings render');
        console.log(data['buildings']);
        console.log(buildingsDataDiv);
      }

      if (data['organizations'].length > 0 && organizationsDataDiv.length > 0){
        renderOrganizationsInfo(organizationsDataDiv, data['organizations']);
      } else {
        console.log('Not running organizations render');
        console.log(data['organizations']);
        console.log(organizationsDataDiv);
      }

      if (data['people'].length > 0 && peopleDataDiv.length > 0){
        renderPeopleInfo(peopleDataDiv, data['people']);
      } else {
        console.log('Not running people render');
        console.log(data['people']);
        console.log(peopleDataDiv);
      }

      if (data['activities'].length > 0 && activitiesDataDiv.length > 0){
        renderActivitiesInfo(activitiesDataDiv, data['activities']);
      } else {
        console.log('Not running activities render');
        console.log(data['activities']);
        console.log(activitiesDataDiv);
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

    function getAndRenderEntitiesData(currentURL) {
      var url = "https://widget.commercialobserver.com/realgraph/entities_data";
      var data = {
        url: currentURL
      };
      jQuery.getJSON(url, data, function(result){
        console.log(result);
        if (result.status){
          renderEntitiesData(result);
        } else {
          console.log('Entities data status is false');
        }
      });
    }

	/******** starting point for your widget ********/
	function main() {
		//your widget code goes here
		jQuery(document).ready(function ($) {
          var currentURL = window.location.href;     // Returns full URL
          pingListener(currentURL);
          getAndRenderEntitiesData(currentURL);

			//example load css
			//loadCss("http://example.com/widget.css");

			//example script load
			//loadScript("http://example.com/anotherscript.js", function() { /* loaded */ });
		});
    }
})(this);
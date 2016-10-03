import { Template } from 'meteor/templating';
import { Weather } from 'meteor/selaias:meteor-simpleweather';

import './main.html';

Template.myWeatherTemplate.onRendered(function(){
	var geooptions = {
		enableHighAccuracy: true,
		timeout: 60000,
		maximumAge: 0
	};

	function success(pos) {
		var days = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
		var lat = pos.coords.latitude;
		var lng = pos.coords.longitude;
		var options = {
			location: lat + ',' + lng,
			unit: 'c',
			success: function(weather) {
				console.log(weather);
				var daysQuantity = 3;
				
          html = '<div class="container"><div class="row">';
          html += '<div class="col s12">'+weather.city+', '+weather.region+', '+weather.country+'</div>';
          html += '<div class="col s6">'+weather.currently+'</div>';
          html += '<div class="col s6">'+weather.temp+'&deg;'+weather.units.temp+'<i class="icon-'+weather.code+'" title="'+weather.text+'"></i></div>';

          for (var i = 1; i <= daysQuantity; i++) {
          	var forecastDay = new Date (weather.forecast[i].date);
          	html += '<div class="col s6">'+days[forecastDay.getDay()]+'</div>';
          	html += '<div class="col s6">'+weather.forecast[i].high+'&deg;'+weather.units.temp+' - '+weather.forecast[i].low+'&deg;'+weather.units.temp+'<i class="icon-'+weather.forecast[i].code+'" title="'+weather.forecast[i].text+'"></i></div>';
          }
          html += '</div></div>';

          $("#weatherDiv").html(html);
      },
      error: function(error) {
      	$("#weatherDiv").html('<p>'+error+'</p>');
      }
  }

  Weather.options = options;
  Weather.load();

}

function error(err) {
	console.warn('ERROR(' + err.code + '): ' + err.message);
}
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(success, error, geooptions);
}
});
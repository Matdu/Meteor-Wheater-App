import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Weather } from 'meteor/selaias:meteor-simpleweather';

import './main.html';

Template.myWeatherTemplate.onCreated(function () {
	Session.setDefault('weatherContent', '');
});

Template.myWeatherTemplate.onRendered(function(){
	this.weatherContent = new ReactiveVar();

	var geooptions = {
		enableHighAccuracy: true,
		timeout: 60000,
		maximumAge: 0
	};

	function success(pos) {
		var lat = pos.coords.latitude;
		var lng = pos.coords.longitude;
		var options = {
			location: lat + ',' + lng,
			unit: 'c',
			lang: 'pt-BR',
			success: function(weather) {
				weather.forecast.splice(0, 1);
				weather.forecast.splice(4, weather.forecast.length);
				Session.set('weatherContent', weather);
			},
			error: function(error) {
				Session.set('weatherContent', false);
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

Template.myWeatherTemplate.helpers({
	currentWeather() {
		return Session.get('weatherContent');
	},
	nextDaysWeather() {
		return weather.forecast;
	},
	forecastDate(date) {
		var day = new Date(date).getDay();
		var weekDays = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
		return weekDays[day];
	}
})
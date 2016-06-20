	
	var map;
	
	//Location/Places data
	/*Template 
	{
			location :{
			lat: ,
			lng: },
			name: "",
			category: [""]
	}
	*/

	var locationData = [
		{
			location:{
			lat: 45.51908,
			lng: -122.678652},
			name: "Pioneer Square courthouse",
			category: ["things to see","fun",""]
		},
		{
			location:{
			lat: 45.520675,
			lng: -122.681730},
			name: "Nongs Khao Man Gai",
			category: ["cart","foodcart","food","stands","thai",""]
		},
		{
			location:{
			lat: 45.525219,
			lng: -122.716309},
			name: "Pittock Mansion",
			category: ["historical",""]
		},
		{
			location:{
			lat: 45.508554,
			lng: -122.713122},
			name: "Oregon Zoo",
			category: ["kids","zoo",""]	
		},
		{
			location:{
			lat: 45.519269,
			lng: -122.677941},
			name: "Departure Pdx",
			category: ["Restaurant","asian","food",""] 

		},
		{
			location:{
			lat: 45.587571,
			lng: -122.742389},
			name: "Falafel House",
			category: ["food cart","foodcart","food","cart","gyro","vegetarian","falafel",""]
		},
		{
			location:{
			lat: 45.514844,
			lng: -122.673395},
			name: "Tom McCall Waterfront Park",
			category: ["park",""] 
		},
		{
			location:{
			lat: 45.518620,
			lng: -122.708431},
			name: "Portland Japanese Garden",
			category: ["park","Garden",""] 
		},
		{
			location:{
			lat: 45.522731,
			lng: -122.607893},
			name: "A N D Cafe",
			category: ["food","cafe","cafes" ,"vegetarian","vegan",""]
		},
		{
			location:{
			lat: 45.522035,
			lng: -122.681717},
			name: " Stumptown Coffee Roasters",
			category: ["coffee","tea","cafe","food",""]
		},
		{
			location:{
			lat: 45.511934,
			lng: -122.626527},
			name: "The waffle Window",
			category: ["breakfast","brunch","waffle","american","fun","food",""]
		},
		{
			location:{
			lat: 45.523105,
			lng: -122.641648},
			name: "Screen Door",
			category: ["breakfast","brunch","food","waffle","cajun",""]
		}

		];
    
    
    var MapViewModel = function() {
	var self = this;

	// Yelp Constants
	var yelpKeyData = {
		consumerKey: 'syjMz4htOdt1lyt1QPp0XA',
		consumerSecret: 'KNslbk6YXtQ0yXtLLeEQZVyXzRI',
		token: '0FK8ZNMjzT-57RuJ9Bev0TsP_cTZjZGZ',
		tokenSecret: 'EzVYcXIWOsTJCrgcWs7L42AoitQ'
	};

	//yelpRequest function to access data from yelp api

	self.yelpRequest = function (nameLocation,marker) {

		var nonce_generate = function() {
			return (Math.floor(Math.random() * 1e12).toString());
		 };
		var data;
		var httpMethod = 'GET',
		consumerKey = yelpKeyData.consumerKey,
		consumerKeySecret = yelpKeyData.consumerSecret,
		url = 'https://api.yelp.com/v2/search?',
		token = yelpKeyData.token,
		signatureMethod = 'HMAC-SHA1',
		version = '1.0',
		local = 'Portland,Oregon', //#use city, state here
		tokenSecret = yelpKeyData.tokenSecret

		var parameters = {
			term: nameLocation,
			location: local,
			oauth_consumer_key: consumerKey,
			oauth_token: token,
			oauth_nonce: nonce_generate(),
			oauth_timestamp: Math.floor(Date.now() / 1000),
			oauth_signature_method: 'HMAC-SHA1',
			callback: 'cb'
		};
	
		var encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerKeySecret, tokenSecret);
		parameters.oauth_signature = encodedSignature;

		var settings = {
			url: url,
			data: parameters,
			cache: true,
			dataType: 'jsonp',
			success: function (result, status, jq) {
				self.jsonGET(result, marker);				
	    	},
			error: function (jq, status, error) {
	    		self.jsonGETFailed(marker);
	    		self.yelpRequest(nameLocation, marker);
	    	}
		}
		
			$.ajax(settings);
		}

	//set center of google map
		
	self.center = new google.maps.LatLng(45.5231, -122.6765);
	
	self.init = function() {
		var mapData = {
			zoom: 14,
			center: self.center,
		};
		// Create a new google maps object and attaching it to the DOM with id='map-canvas'
		self.map = new google.maps.Map(document.getElementById('map'), mapData);
		
		self.markers = ko.observableArray([]);
		// Creates a marker and pushes into self.markers array
		$.each(locationData, function(key, data) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(data.location.lat, data.location.lng),
				map: self.map,
				listVisible: ko.observable(true),
				animation: google.maps.Animation.DROP,
				name: data.name,
				category:data.category
			});
			// send AJAX request to get data
			self.yelpRequest(data.name, marker);
			
			// Bind a infowindow object and animation for marker
			var contentString = '<div><h1>'+ data.name + '</h1></div>' 
			self.infowindow = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'click', function() {
				self.map.panTo(marker.getPosition());
				// Make marker icon bounce only once
				marker.setAnimation(google.maps.Animation.BOUNCE);
    			setTimeout(function(){ marker.setAnimation(null); }, 750);
				self.infowindow.setContent(contentString);
			    self.infowindow.open(self.map, this);
			});
			
			self.markers.push(marker);
		});
		google.maps.event.addListener(self.infowindow,'closeclick', function() {
			self.resetCenter();
		});
	};
	
	self.setCurrentRestuarant = function(marker) {
		google.maps.event.trigger(marker, 'click');
	};
	
	// Once data is successful update
	self.jsonGET = function(data, markerToUpdate) {
		var contentString = '<div><h1>'+ markerToUpdate.name + '</h1><p> Phone : ' + data.businesses[0].phone + '</p><p> Rating: ' + data.businesses[0].rating +' | # of Reviews: '+ data.businesses[0].review_count + '</p><img src="'+ data.businesses[0].rating_img_url + '"></img></div>';
		self.infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(markerToUpdate, 'click', function() {
			self.infowindow.setContent(contentString);
		    self.infowindow.open(self.map, this);
		});
	};
	
	// Once data is unsuccessful tell user 
	self.jsonGETFailed = function(markerToUpdate) {
		var contentString = '<div><h1>'+ markerToUpdate.name + '</h1><p>' + markerToUpdate.address + '</p><p> Rating: ERROR | # of Reviews: ERROR</p><p>Resending Request</p>></div>';
		self.infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(markerToUpdate, 'click', function() {
			self.infowindow.setContent(contentString);
		    self.infowindow.open(self.map, this);
		});
	};
	
	self.resetCenter = function() {
		self.map.panTo(self.center);
	};
	self.locationListIsOpen = ko.observable(true);
	
	self.toggleLocationListIsOpen = function() {
		self.locationListIsOpen(!self.locationListIsOpen());
	};
	
	self.toggleLocationListIsOpenButtonText = ko.computed( function() {
    	return self.locationListIsOpen() ? "hide" : "show";
    });
    
    self.toggleLocationListIsOpenStatus = ko.computed( function() {
    	return self.locationListIsOpen() ? true : false;
    });
	
	
	self.filterWord = ko.observable("");
	self.filterWordSearch = ko.computed( function() {
    	return self.filterWord().toLowerCase().split(' ');
    });

    // Filter
    
    self.filterSubmit = function() {
    	self.filterWordSearch().forEach(function(word) {
    		self.markers().forEach(function(marker) {
    			var name = marker.name.toLowerCase();
    			var category = marker.category;

    			((name.indexOf(word) === -1) && category.indexOf(word) === -1 ) ? marker.setMap(null) : marker.setMap(self.map);
    			((name.indexOf(word) === -1) && category.indexOf(word) === -1) ? marker.listVisible(false) : marker.listVisible(true);
    			
    		});
    	});
    	self.filterWord("");
    };
    
	self.init();
};

$(ko.applyBindings(new MapViewModel()));


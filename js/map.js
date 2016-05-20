	
	var map;
	var myLatLng = {lat: 45.5231, lng: -122.6765};
	var markersArr = [];
	var defaultDisplay = true;

	// Yelp Constants
	var yelpKeyData = {
		consumerKey: 'syjMz4htOdt1lyt1QPp0XA',
		consumerSecret: 'KNslbk6YXtQ0yXtLLeEQZVyXzRI',
		token: '0FK8ZNMjzT-57RuJ9Bev0TsP_cTZjZGZ',
		tokenSecret: 'EzVYcXIWOsTJCrgcWs7L42AoitQ'
	};
	
	//Location/Places data
	/*Template 
	{
			lat: ,
			lng: ,
			title: "",
			category: [""]
	}
	*/

	var marker = {
		"places" : [
		{
			lat: 45.51908,
			lng: -122.678652,
			title: "Pioneer Square courthouse",
			category: ["things to see","fun",""]
		},
		{
			lat: 45.520675,
			lng: -122.681730,
			title: "Nongs Khao Man Gai",
			category: ["food cart","foodcart","food","food stands","thai",""]
		},
		{
			lat: 45.525219,
			lng: -122.716309,
			title: "Pittock Mansion",
			category: ["things to see","historical",""]
		},
		{
			lat: 45.508554,
			lng: -122.713122,
			title: "Oregon Zoo",
			category: ["things to see","kids","zoo",""]	
		},
		{
			lat: 45.519269,
			lng: -122.677941,
			title: "Departure Pdx",
			category: ["Restaurant","asian","food",""] 

		},
		{
			lat: 45.587571,
			lng: -122.742389,
			title: "Falafel House",
			category: ["food cart","foodcart","food","food stands","gyro","vegetarian","falafel",""]
		},
		{
			lat: 45.514844,
			lng: -122.673395,
			title: "Tom McCall Waterfront Park",
			category: ["things to see","park",""] 
		},
		{
			lat: 45.518620,
			lng: -122.708431,
			title: "Portland Japanese Garden",
			category: ["things to see","park","Garden",""] 
		},
		{
			lat: 45.522731,
			lng: -122.607893,
			title: "A N D Cafe",
			category: ["food","cafe","cafes" ,"vegetarian","vegan",""]
		},
		{
			lat: 45.522035,
			lng: -122.681717,
			title: " Stumptown Coffee Roasters",
			category: ["coffee","tea","cafe","food",""]
		},
		{
			lat: 45.511934,
			lng: -122.626527,
			title: "The waffle Window",
			category: ["breakfast","brunch","waffle","american","fun","food",""]
		},
		{
			lat: 45.523105,
			lng: -122.641648,
			title: "Screen Door",
			category: ["breakfast","brunch","food","waffle","cajun",""]
		}

		]

	};
    
    //Init Function to start load the map with initial location
    var initMap = function() {
    	//cerate map object
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 45.5231, lng: -122.6765},
          zoom: 14
        });

        //loop to create placeMarker objs, push them to markersArr and call setMarkers() for each placeMarker object

        var placeMarker;
		for (i in marker.places) {
					
			placeMarker = new google.maps.Marker({
		    position: {lat: marker.places[i].lat, lng:marker.places[i].lng},
		    title:marker.places[i].title
		});
		
		markersArr.push(placeMarker);
    	
    	//Marks only first 5 places as default from the array
    	if(defaultDisplay == true && i<5 )
    	setMarkers(placeMarker);
 		}
    }

    //Function to set Markers on the map
	var setMarkers = function(placeMarker) {

		placeMarker.setMap(map);
		
	}

	var removeMarkers = function(){
		for(i in markersArr) {
			markersArr[i].setMap(null);
		}
	}

	var ViewModel = function() {
		var self = this;

		self.locationList = ko.observableArray([]);
		self.query = ko.observable('');

		//Displays the default list view of the markers

			for(places in marker.places)
			{
				//Sets only first 5 places as default from the array
				if(defaultDisplay == true && places<5)
				self.locationList.push(marker.places[places].title);
			}
		
		//Search function invoked when something is typed in #search-box
		self.search = function (data,event) {
			
			//works only when Enter key is pressed
			if(event.which == 13)
			{
				//empty the locationList array
				self.locationList.removeAll();
				removeMarkers(); 
				//get data from #seach-box
				self.query($('#search-box').val());
				
			
			//loop to iterate and filter the category user typed
				for(i in marker.places){
					
					for(j in marker.places[i].category)
					{
						
						if (self.query().toLowerCase() == marker.places[i].category[j] ) {
							
							//Add the place to locationList observableArray
							self.locationList.push(marker.places[i].title);
							//console.log("found " + marker.places[i].category[j]);						
							console.log(marker.places[i].title);
							//place the searched on the map
							setMarkers(markersArr[i]);
						}
				
					}
				}
			} //end of if
		 
		} //end of search function
	} //end of View model

	initMap();
	ko.applyBindings(new ViewModel());


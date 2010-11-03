// =====================================================================================
// CONSTANTS
// =====================================================================================

// TODO: Undo this before packaging
var TESTING = true;

var DINEVORE_URL_BASE = "http://dinevore:erovenid@api.dinevore.com/v1";

var currentWindow = null;

// =====================================================================================
// HELPER FUNCTIONS
// =====================================================================================

function createAppSingleWindow(url, title) {
    var win = Ti.UI.createWindow({
        url: url,
        title: title,
        tabBarHidden:true,
        navBarHidden:true
    });

    if (Ti.Platform.osname != 'android') {
        win.hideTabBar();
        
        var tab = Ti.UI.createTab({
            title: 'tab',
            window: win
        });
    
        var tabGroup = Ti.UI.createTabGroup();
        tabGroup.addTab(tab);

        tabGroup.open();
    } else {
        win.open();
    }
    
    return win;
}

function openWindow(url, title) {    
    var win = Ti.UI.createWindow({  
        url: url,
        title: title,
        fullscreen: false,
        tabBarHidden:true,
        navBarHidden:true
    });
    
    if (Ti.UI.currentTab != null) {
        Ti.UI.currentTab.open(win, {});
    } else {
        win.open({});
    }
    
    currentWindow.close();
    return win;
}

// Send a location update for a given Lat/Lon
function fireLatLon(lat, lon) {
    Ti.App.Properties.setDouble('lat', lat);
    Ti.App.Properties.setDouble('lon', lon);
    
    // TODO: remove
    //alert('Lat/Lon: ' + lat + ',' + lon);

    Ti.App.fireEvent('getNearby', {
        lat:lat,
        lon:lon
    });   
}

// Generic request functionality
function getRequest(url, callback) {
    var xhr = null;
    
    try {
        xhr = Ti.Network.createHTTPClient();
    } catch (http_error) {
        alert('Error while creating HTTPClient');
    }
    
    // h4x: this line is needed to make sure onload event fires
    xhr.onreadystatechange  = function() {}; 
    
    xhr.onload = function() {
        // This code will get called when a response is returned from our web-service
        // This is passed in as a complete closure to be executed asynchronously
        var resourceList = null;
        
        try {
            // Try parsing the JSON response
            resourceList = JSON.parse(this.responseText);
        } catch (json_error) {
            // This is the case where we did not get proper JSON back
            // This is most likely an "invalid email" response
            // NOTE: I only got this working on the iPhone, not on Android...
            // Android gives an TiHttpClient error "Not Found" without ever getting to the try/catch  =(
            alert('Error: ' + this.responseText);
        }
        
        if (resourceList != null) {
            // Only call our callback if we were able to get a proper JSON response
            callback(resourceList);
        }
    };
    
    try {
        xhr.open('GET', url);
        xhr.send();        
    } catch (xhr_error) {
        alert('Error while retrieving nearby restaraunts. Please try again later.');
    }
}

// Accept the list of restaurants (as a callback)
// Send restaurant list data to the near-by tab
function receiveNearby(nearbyRestaurants) {
    var data = [];
    for (var i = 0; i < nearbyRestaurants.length; i++) {
        var restaurant = nearbyRestaurants[i].restaurant;
        data.push(restaurant);
    }

    if (currentWindow.title != 'Nearby') {
        // If the Nearby window is NOT currently open, open it
        // This is meant to keep an infinite-loop from happening
        // In the event that we update our nearby list from within the nearby window  =/
        currentWindow = openWindow('windows/nearby.js', 'Nearby');
    } else {
        // If we have the Nearby window open, now, we can tell it to refresh the list
        // We do not have to call it if Nearby is not open
        // Since nobody else cares about this data (and since Nearby calls this function again)
        Ti.App.fireEvent('updateNearby', {
            data:data
        });
    }
}

// =====================================================================================
// EVENT LISTENERS
// =====================================================================================

Ti.App.addEventListener('updateGeo', function() {
    if (true == TESTING) {
        alert('Setting lat/lon with test values');
        fireLatLon(40.7256, -73.991375); 
    } else {
        Ti.Geolocation.purpose = "Find restaurant locations near to user's lat/long location";
        Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
        Ti.Geolocation.getCurrentPosition(function(e) {
            if (e.error) {
                alert("We can't get your current location.");
            } else {
                fireLatLon(e.coords.latitude, e.coords.longitude);
            }
        });
    } // end testing if location services enabled
});

// listen for events from tabs
Ti.App.addEventListener('getNearby', function(event){
    var nearbyUrl = "/users/" + Ti.App.Properties.getString('email') + "/default_lists.json?filter_by=wanted&radius=5000";
    getRequest(DINEVORE_URL_BASE + nearbyUrl + '&lat=' + event.lat + '&lon=' + event.lon, receiveNearby);
});

// =====================================================================================
// APP FLOW
// =====================================================================================

currentWindow = createAppSingleWindow('windows/login.js', 'Login');

//check for network connectivity
if (Ti.Network.online == false) {
  alert("You don't have internet access, please try again later");
}
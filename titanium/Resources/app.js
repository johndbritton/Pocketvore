// =====================================================================================
// CONSTANTS
// =====================================================================================

var baseUrl = "http://dinevore:erovenid@api.dinevore.com/v1";

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

//check for network connectivity
if (Ti.Network.online == false) {
  alert("You don't have internet access, please try again later");
}

Ti.App.addEventListener('updateGeo', function(event) {
  Ti.Geolocation.purpose = "Recieve User Location";
  Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
  Ti.Geolocation.getCurrentPosition(function(e) {
    if (e.error) {
      alert("We can't get your current location.");
      tabGroup.close();
      login.open();
      return;
    }
    Ti.App.Properties.setDouble('lat', e.coords.latitude);
    Ti.App.Properties.setDouble('lon', e.coords.longitude);
    Ti.App.fireEvent('getNearby', {lat:Ti.App.Properties.getDouble('lat'),lon:Ti.App.Properties.getDouble('lon')});
  });
});

//generic request functionality
function getRequest(url, callback) {
  //alert(url);
  var xhr = Ti.Network.createHTTPClient();
  xhr.onreadystatechange  = function() {}; //needed to make sure onload event fires
  xhr.onload = function(){
    var resourceList = JSON.parse(this.responseText);
    callback(resourceList);
  };
  xhr.open('GET', url);
  xhr.send();
}

//send data to the tab
function updateNearby(nearbyRestaurants) {
  var data = [];
  for (var i=0; i<nearbyRestaurants.length; i++) {
    var restaurant = nearbyRestaurants[i].restaurant;
    data.push(restaurant);
  }
  Ti.App.fireEvent('updateNearby', {data:data});
}

// listen for events from tabs
Ti.App.addEventListener('getNearby', function(event){
  var nearbyUrl = "/users/"+ Ti.App.Properties.getString('email') +"/default_lists.json?filter_by=wanted&radius=5000";
  getRequest(baseUrl + nearbyUrl + '&lat=' + event.lat + '&lon=' + event.lon, updateNearby);
});

// =====================================================================================
// APP FLOW
// =====================================================================================

currentWindow = createAppSingleWindow('windows/login.js', 'Login');
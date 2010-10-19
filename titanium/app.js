var baseUrl = "http://dinevore:erovenid@api.dinevore.com/v1";

//check for network connectivity
if (Ti.Network.online == false) {
  alert("You don't have internet access, please try again later");
}

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

var login = Titanium.UI.createWindow({
  tabBarHidden:true,
  navBarHidden:true,
  url:'windows/login.js'
});

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

//
// create windows
//

var nearby = Titanium.UI.createWindow({
  title:'Nearby',
  tabBarHidden:true,
  navBarHidden:true,
  url:'windows/nearby.js'
});

//
// create tabs
//
var nearbyTab = Titanium.UI.createTab({
    icon:'nearby.png',
    title:'Nearby',
    window:nearby
});



Ti.App.addEventListener('login', function(event){
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if(reg.test(Ti.App.Properties.getString('email'))) {
    login.close();
    Ti.App.fireEvent('updateGeo');
    // open tab group
    tabGroup.open();
  } else {
    alert("You must provide your Dinevore email address to access your lists.");
  }
});

tabGroup.addTab(nearbyTab);

login.open();
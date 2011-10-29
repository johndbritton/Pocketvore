// First things first ..............
var restaurantView = Ti.UI.createView({
  backgroundColor:'#E5E5DB'
});
// Pull the Restaurant object out of the call
var restaurant = Ti.UI.currentWindow.restaurant;

// =====================================================================================
// UI
// =====================================================================================

var restaurantHeader = Ti.UI.createImageView({
  image:'../details_header.png',
  height:67,
  width:320,
  top:0,
  right:0
});

var detailsBackground = Ti.UI.createView({
  backgroundColor:'#FFFFFF',
  borderRadius:10,
  height:370,
  width:295,
  top:79,
  left:12
});

var note = Ti.Map.createAnnotation({
  latitude:restaurant.latitude,
  longitude:restaurant.longitude,
  title:restaurant.name,
  subtitle: Math.floor(restaurant.distance_to_center) + 'm, ' + restaurant.average_price_range,
  animate:true
});

if (Ti.Platform.osname == 'android') {
    note.pinImage = "../restaurant_pin.png";
} else {
    note.pincolor = Titanium.Map.ANNOTATION_RED;
}

var map = Ti.Map.createView({
  mapType: Ti.Map.STANDARD_TYPE,
  region: {latitude:restaurant.latitude, longitude:restaurant.longitude,
          latitudeDelta:0.005, longitudeDelta:0.005},
  animate:true,
  regionFit:true,
  userLocation:true,
  annotations:[note],
  borderRadius:10,
  height:140,
  width:275,
  top:170,
  left:10
});

var address = Ti.UI.createLabel({
  text:restaurant.street,
  font:{fontFamily:'Verdana',fontSize:14},
  color:'#5E4319',
  bottom:10,
  left:142,
  height:42,
  width:144,
  textAlign:'left'
});

var phone = Ti.UI.createButton({
  title:restaurant.phone_number,
  backgroundImage:'../phone_background.png',
  color:'#FFF',
  width:145,
  height:36,
  top:34,
  left:10
});

var backButton = Ti.UI.createButton({
  backgroundImage:'../back_button.png',
  bottom:10,
  left:10,
  height:39,
  width:77
});

var mapButton = Ti.UI.createButton({
  backgroundImage:'../map_pin.png',
  bottom:10,
  left:92,
  height:42,
  width:42
});

// Adding a label to a button in Android did not work
// This is a h4x where we set the button's title instead
// But we need to move the text over to align it with the "Dinos" text...
// ...so we use a bunch of spaces...  =/
var listedButton = Ti.UI.createButton({
  backgroundImage:'../listed.png',
  title:'          "Want to Try"',
  color:'#377c8e',
  height:40,
  width:276,
  top:80,
  left:10
});

var eatenButton = Ti.UI.createButton({
  backgroundImage:'../dinos.png',
  title:'None',
  color:'#787a46',
  height:40,
  width:276,
  top:123,
  left:10
});

var scoreBackground = Ti.UI.createImageView({
  image:'../details_score_bg.png',
  width:74,
  height:70,
  top:0,
  right:0
});

var score = Ti.UI.createLabel({
  text:restaurant.rounded_dinescore,
  color:'#FFFFFF',
  font:{fontFamily:'Georgia',fontSize:24,fontWeight:'bold'},
  textAlign:'right',
  right:15
});

var title = Ti.UI.createLabel({
  text:restaurant.name,
  textAlign:'left',
  font:{fontFamily:'Verdana',fontSize:17,fontWeight:'bold'},
  color:'#5E4319',
  width:215,
  height:25,
  left:10,
  top:5
});

// =====================================================================================
// EVENTS
// =====================================================================================

phone.addEventListener('click', function(e){
  number = e.source.title.replace(/\-|\(|\) /gi,'');
  Ti.Platform.openURL('tel:'+number);
});

mapButton.addEventListener('click', function(e, restaurant){
  slat = Ti.App.Properties.getDouble('lat');
  slon = Ti.App.Properties.getDouble('lon');
  dlat = Ti.UI.currentWindow.restaurant.latitude;
  dlon = Ti.UI.currentWindow.restaurant.longitude;
  var url = "http://maps.google.com/maps?f=d&source=s_d&saddr="+slat+","+slon+"&daddr="+dlat+","+dlon;
  Ti.Platform.openURL(url);
});

backButton.addEventListener('click', function(e){
  Ti.UI.currentWindow.close();
});

// =====================================================================================
// APP FLOW
// =====================================================================================

if (restaurant.phone_number == '') {
  phone.title = 'unlisted';
}

scoreBackground.add(score);
detailsBackground.add(scoreBackground);

detailsBackground.add(map);
detailsBackground.add(address);
detailsBackground.add(phone);
detailsBackground.add(backButton);
detailsBackground.add(mapButton);
detailsBackground.add(listedButton);
detailsBackground.add(eatenButton);
detailsBackground.add(title);

restaurantView.add(restaurantHeader);
restaurantView.add(detailsBackground);

Ti.UI.currentWindow.add(restaurantView);
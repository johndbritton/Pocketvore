var restaurant = Ti.UI.currentWindow.restaurant;
var restaurantView = Ti.UI.createView({
  backgroundColor:'#E5E5DB'
});

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
  pincolor:Titanium.Map.ANNOTATION_RED,
  animate:true
});

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
  width:145,
  height:36,
  top:34,
  left:10
});

if (restaurant.phone_number == '') {
  phone.title = 'unlisted';
}

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

var listedButton = Ti.UI.createButton({
  backgroundImage:'../listed.png',
  height:40,
  width:276,
  top:80,
  left:10
});

var eatenButton = Ti.UI.createButton({
  backgroundImage:'../dinos.png',
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

var listed = Ti.UI.createLabel({
  text:'"Want to Try"',
  color:'#377c8e',
  width:165,
  left:100
});

var eaten = Ti.UI.createLabel({
  text:'None',
  color:'#787a46',
  width:165,
  left:100
});

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

restaurantView.add(restaurantHeader);
restaurantView.add(detailsBackground);
detailsBackground.add(map);
detailsBackground.add(address);
detailsBackground.add(phone);
detailsBackground.add(backButton);
detailsBackground.add(mapButton);
detailsBackground.add(listedButton);
detailsBackground.add(eatenButton);
detailsBackground.add(title);
detailsBackground.add(scoreBackground);
scoreBackground.add(score);

listedButton.add(listed);
eatenButton.add(eaten);

Ti.UI.currentWindow.add(restaurantView);
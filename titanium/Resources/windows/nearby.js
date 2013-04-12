// =====================================================================================
// UI
// =====================================================================================

var nearbyHeader = Ti.UI.createImageView({
  image:'../nearby_header.png',
  height:67,
  width:320,
  top:0,
  right:0
});

var nearbyListTableView = Ti.UI.createTableView({
  data:[],
  backgroundColor:'#E5E5DB',
  rowHeight:74,
  top:67
});

// =====================================================================================
// HELPER FUNCTIONS
// =====================================================================================

function sortRestaurantsByDistance(a, b){
  return (a.distance_to_center - b.distance_to_center);
}

function openWindow(url, title, restaurant) {
    var win = Ti.UI.createWindow({
        url: url,
        title: title,
        fullscreen: false,
        tabBarHidden:true,
        navBarHidden:true,
        restaurant: restaurant
    });

    if (Ti.UI.currentTab != null) {
        Ti.UI.currentTab.open(win, {});
    } else {
        win.open({});
    }

    return win;
}

// =====================================================================================
// EVENTS
// =====================================================================================

nearbyHeader.addEventListener('click', function(e){
  Ti.App.fireEvent('updateGeo');
});

// listen for new nearby restaurants
Ti.App.addEventListener('updateNearby', function(event){
// update nearby display
  var data = [];
  var restaurants = event.data;
  restaurants.sort(sortRestaurantsByDistance);

  for (var i=0; i<restaurants.length; i++) {
    var backgroundImageUrl = '../table_view_cell_background.png';

    if (restaurants[i].rounded_dinescore > 85) {
      backgroundImageUrl = '../high_score.png';
    } else if (restaurants[i].rounded_dinescore > 0) {
      backgroundImageUrl = '../score.png';
    } else {
      backgroundImageUrl = '../no_score.png';
    }

    // This is PURELY COSMETIC
    // Sux, I know...
    // ...but Android will format the rounded_dinescore as a decimal w/ 1 decimal place (XX.0)
    var formatted_score = '';
    if (restaurants[i].rounded_dinescore > 0) {
        formatted_score = '' + restaurants[i].rounded_dinescore;
        if (formatted_score.indexOf('.') != -1) {
            formatted_score = formatted_score.substring(0, formatted_score.indexOf('.'));
        }
    }

    var row = Ti.UI.createTableViewRow({
      backgroundImage:backgroundImageUrl,
      height:74
    });

    var name = Ti.UI.createLabel({
      text:restaurants[i].name,
      font:{fontFamily:'Verdana',fontSize:17,fontWeight:'bold'},
      color:'#5E4319',
      textAlign:'left',
      top:15,
      left:10,
      height:22,
      width:230
    });

    var price = Ti.UI.createLabel({
      text:restaurants[i].average_price_range,
      font:{fontFamily:'Verdana',fontSize:17},
      color:'#B8552A',
      width:'auto',
      textAlign:'left',
      left:150,
      bottom:10,
      height:22
    });

    var distance = Ti.UI.createLabel({
      text:Math.floor(restaurants[i].distance_to_center) + "m",
      font:{fontFamily:'Verdana',fontSize:14,fontWeight:'bold'},
      color:'#5E4319',
      width:'auto',
      textAlign:'right',
      top:20,
      right:5,
      height:16
    });

    var cuisine = Ti.UI.createLabel({
      text:restaurants[i].supported_cuisines,
      font:{fontFamily:'Verdana',fontSize:14,fontStyle:'italic'},
      color:'#5E4319',
      bottom:10,
      left:10,
      height:20,
      width:130
    });

    var score = Ti.UI.createLabel({
      text:formatted_score,
      font:{fontFamily:'Georgia',fontSize:24,fontWeight:'bold'},
      color:'#FFFFFF',
      right:5,
      height:30,
      bottom:10,
      width:50,
      textAlign:'right'
    });

    row.add(name);
    row.add(price);
    row.add(distance);
    row.add(cuisine);
    row.add(score);
    row.restaurant = restaurants[i];
    row.className = 'nearby_row';

    data.push(row);
  } // end of for loop creating rows

  nearbyListTableView.setData(data);
});

nearbyListTableView.addEventListener('click', function(e) {
    openWindow('restaurant.js', e.rowData.restaurant.name, e.rowData.restaurant);
});

// =====================================================================================
// APP FLOW
// =====================================================================================

// Whenever this view opens, we should update this list of Nearby restaurants !
// Forward-firing events (firing updateGeo and then opening this View) do not work for Android (that I could figure out)
// Instead, we re-fire this event when we load this View so that we are open (and able) to handle it
Ti.App.fireEvent('updateGeo');

Ti.UI.currentWindow.add(nearbyHeader);
Ti.UI.currentWindow.add(nearbyListTableView);
// First things first ..............
var loginView = Ti.UI.createView({});

// =====================================================================================
// UI
// =====================================================================================

var background = Ti.UI.createImageView({
  image:'../login_background.png',
  top:0,
  height:480,
  width:320
});

var aboutButton = Ti.UI.createButton({
  backgroundImage:'../48badge.png',
  top:0,
  left:20,
  height:109,
  width:167
});

var signupButton = Ti.UI.createButton({
  backgroundImage:'../signup_button.png',
  height:44,
  width:129,
  left:20,
  bottom:40
});

var goButton = Ti.UI.createButton({
  backgroundImage:'../go_button.png',
  height:44,
  width:129,
  right:20,
  bottom:40
});

var emailTextField = Ti.UI.createTextField({
  backgroundImage:'../text_field.png',
  hintText:'name@example.com',
  value:Ti.App.Properties.getString('email'),
  paddingLeft:10,
  paddingRight:10,
  height:44,
  width:280,
  left:20,
  bottom:104
});

// =====================================================================================
// HELPER FUNCTIONS
// =====================================================================================

function openWebWindow(url, title) {
    var closeWebViewButton = Ti.UI.createButton({
        title:'Close'
    });

    closeWebViewButton.addEventListener('click', function(e){
        webViewWindow.close();
    });

    var webViewWindow = Ti.UI.createWindow({
        url:'web.js',
        title:title,
        leftNavButton:closeWebViewButton,
        dest_url:url
    });

    webViewWindow.open({
        modal:true
    });
}

// =====================================================================================
// EVENTS
// =====================================================================================

signupButton.addEventListener('click', function(e){
    openWebWindow('http://dinevore.com/signup/mobile', 'Sign Up Up For Dinevore');
});

aboutButton.addEventListener('click', function(e){
    openWebWindow('http://48hourapps.com/pocketvore', 'About Pocketvore');
});

goButton.addEventListener('click', function(e){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var user_email = emailTextField.value;
    if(reg.test(user_email)) {
        Ti.App.Properties.setString('email', user_email);
        Ti.App.fireEvent('updateGeo');
    } else {
        alert("You must provide your Dinevore email address to access your lists.");
    }
});

// Apple-only events for text-field UX
if (Ti.Platform.osname != 'android') {
    emailTextField.addEventListener('focus', function(e){
      loginView.top = -216;
      loginView.bottom = 216;
    });

    emailTextField.addEventListener('blur', function(e){
      loginView.top = 0;
      loginView.bottom = 0;
    });
}

// =====================================================================================
// APP FLOW
// =====================================================================================

loginView.add(background);
loginView.add(aboutButton);
loginView.add(emailTextField);
loginView.add(signupButton);
loginView.add(goButton);

Ti.UI.currentWindow.add(loginView);
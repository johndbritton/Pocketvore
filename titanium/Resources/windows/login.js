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

signupButton.addEventListener('click', function(e){
  var closeWebViewButton = Ti.UI.createButton({
    title:'Close'
  });
  
  closeWebViewButton.addEventListener('click', function(e){
    webViewWindow.close();
  });
  
  var webViewWindow = Ti.UI.createWindow({
    url:'web.js',
    title:'Sign up for Dinevore',
    leftNavButton:closeWebViewButton,
    dest_url:'http://dinevore.com/signup/mobile'
  });
  webViewWindow.open({modal:true});
});

aboutButton.addEventListener('click', function(e){
  var closeWebViewButton = Ti.UI.createButton({
    title:'Close'
  });
  
  closeWebViewButton.addEventListener('click', function(e){
    webViewWindow.close();
  });
  
  var webViewWindow = Ti.UI.createWindow({
    url:'web.js',
    title:'About Pocketvore',
    leftNavButton:closeWebViewButton,
    dest_url:'http://48hourapps.com/pocketvore'
  });
  webViewWindow.open({modal:true});
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

goButton.addEventListener('click', function(e){
  Ti.App.Properties.setString('email', emailTextField.value);
  Ti.App.fireEvent('login');
});

emailTextField.addEventListener('focus', function(e){
  loginView.top = -216;
  loginView.bottom = 216;
});

emailTextField.addEventListener('blur', function(e){
  loginView.top = 0;
  loginView.bottom = 0;
});

loginView.add(background);
loginView.add(aboutButton);
loginView.add(signupButton);
loginView.add(goButton);
loginView.add(emailTextField);

Ti.UI.currentWindow.add(loginView);
var win = Ti.UI.currentWindow;

var webView = Ti.UI.createWebView({
  url:Ti.UI.currentWindow.dest_url
});

webView.show();

win.add(webView);
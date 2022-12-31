chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.formula) {
      chrome.runtime.sendMessage({formula: request.formula});
    } else if (request.regenerate) {

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {regenerate: true});
      });
    }
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.copy) {
      navigator.clipboard.writeText(request.copy);
    }
});
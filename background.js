let date = Date.now();
var date2 = Date.now();
let countdownMaxInMin = 20;
let countdownMaxInSec = countdownMaxInMin * 60;
let countdownMaxInMS = countdownMaxInSec * 1000;

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({})],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});

chrome.storage.local.set({
  date: date,
  isPaused: false,
  startTime: false,
  countdownMaxInMin: countdownMaxInMin
});


clearAndCreateAlarm(countdownMaxInMin,countdownMaxInMin);

// Add a listener for when the alarm is up.
// When the alarm is up, create a window with timer.html.
chrome.alarms.onAlarm.addListener(function(alarm) {
    
  if (alarm.name == 'eyeRestAlarm' + date) {
    let nextAlarmTime = alarm.scheduledTime + countdownMaxInMS;
    chrome.storage.local.set({nextAlarmTime: nextAlarmTime});

    chrome.windows.create({
      type: 'popup',
      url: 'timer.html',
      width: 500,
      height: 520,
      left: 5,
      top: 100,
      focused: true
    });
  } else {
    chrome.alarms.getAll(function(data) {
      data.forEach(function(alarm) {
        if (alarm.name != 'eyeRestAlarm' + date) {
          chrome.alarms.clear(alarm.name);
        }
      });
    });
  }
});

chrome.runtime.onStartup.addListener(function() {
 chrome.storage.local.set({upTime: Date.now()});
})

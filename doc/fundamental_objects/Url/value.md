# Url.value
The `value` property specifies the full URL of the page being monitored.

## Examples
```javascript
new Url().value;        // null

new Url('').value;      // "https://www.dropboxforum.com/hc/en-us"
new Url('test').value;  // "https://www.dropboxforum.com/hc/en-us/test"

new Url('?page=1').value;           // "https://www.dropboxforum.com/hc/en-us"
new Url('home?id=5', false).value;  // "https://www.dropboxforum.com/hc/en-us/home"
new Url('?page=2', true).value;     // "https://www.dropboxforum.com/hc/en-us?page=2"
```

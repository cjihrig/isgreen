# isgreen
Is your io.js installation up to date?

## Usage

```javascript
var isGreen = require('isgreen');

isGreen(function(err, result) {
  if (err) {
    return console.error(err);
  }

  console.log(result); // result is a Boolean
}
});
```

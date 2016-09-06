# insertAndMarkupTextAtCursorPosition()
The `insertAndMarkupTextAtCursorPosition()` function marks up the text selected within the post form with given HTML tags.

## Syntax
```
insertAndMarkupTextAtCursorPosition(tag1[, tag2[, ...tagN]])
```

### Parameters
`tag1, tag2, ... tagN`
> Strings representing HTML tags to be wrapped around the selected text. The first argument as `tag1` represents the outermost tag, with every subsequent argument being inside the previous.

### Return value
`insertAndMarkupTextAtCursorPosition()` returns a boolean representing whether or not the markup was successful.

## Description
`insertAndMarkupTextAtCursorPosition()` takes string arguments representing text to create HTML tags from. If any of the arguments passed into `insertAndMarkupTextAtCursorPosition()` matches the regular expression `/[^a-zA-Z]/g`, the function will not markup any text, and will return `false`.

## Example
```javascript
insertAndMarkupTextAtCursorPosition('test');     // True
insertAndMarkupTextAtCursorPosition('<test>');   // False

insertAndMarkupTextAtCursorPosition('blockquote', 'code');  // True
insertAndMarkupTextAtCursorPosition('span', '<span>');      // False
```

# insertSelectedQuote()
The `insertSelectedQuote()` function inserts the given text and author details as a quote at the current cursor position in the post form.

## Syntax
```
insertSelectedQuote(quote, authorDetails)
```

### Parameters
`quote`
> A string representing the text or HTML to be quoted.

`authorDetails`
> A string representing the formatted tag referencing the user to be quoted. `authorDetails` is typically created via [`getPostAuthorDetails()`](getPostAuthorDetails.md).

### Return value
`insertSelectedQuote()` will return the selected quote back to the user when finished.

If the quote or author details are missing or not strings, `insertSelectedQuote()` will instead return `undefined`.

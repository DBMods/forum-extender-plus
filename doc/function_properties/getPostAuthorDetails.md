# getPostAuthorDetails()
The `getPostAuthorDetails()`  function parses a given element selector into a formatted string representing the author of a post.

## Syntax
```
getPostAuthorDetails(eventTarget)
```

### Parameters
`eventTarget`
> A jQuery selector representing the target post.

### Return value
`getPostAuthorDetails()` returns the formatted HTML string representing the post author to be used in a quote.

If `eventTarget` is not a valid jquery element, `getPostAuthorDetails()` will return `undefined`.

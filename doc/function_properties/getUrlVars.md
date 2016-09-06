# getUrlVars()
The `getUrlVars()` function parses a list of URL parameters and their values from a given URL string.

## Syntax
```
getUrlVars(url)
```

## Parameters
`url`
> A string representing the URL of a webpage.

## Return value
An object with key/value pairs corresponding to the URL parameters and their associated values.

If no URL parameters are found, `getUrlVars()` will return an empty object.

If the argument of `getUrlVars()` is not a string, `getUrlVars()` will return the argument unchanged.

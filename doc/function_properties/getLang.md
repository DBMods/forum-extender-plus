# getLang()
The `getLang()` function parses a language slug from a given URL string.

## Syntax
```
getLang(url)
```

### Parameters
`url`
> A string representing the URL of a webpage.

### Return value
A string representing the language URL slug within the given URL.

If the argument contains a URL that is from the forums and a language is not present, `getLang()` will return `"en-us"`.

If the argument represents a foreign domain, or it is not a string, `getLang()` will return `undefined`.

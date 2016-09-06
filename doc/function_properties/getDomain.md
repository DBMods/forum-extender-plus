# getDomain()
The `getDomain()` function parses a web domain from a given URL string.

## Syntax
```
getDomain(url)
```

### Parameters
`url`
> A string representing the URL of a webpage.

### Return value
A string representing the web domain of the active page, including the HTTP(S) protocol.

If the argument of `getDomain()` is not recognized as a domain, `getDomain()` will return ```undefined```.

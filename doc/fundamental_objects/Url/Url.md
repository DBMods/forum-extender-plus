# Url
The **`Url` constructor** creates a new `Url` object.

## Syntax
```javascript
new Url(url[, captureParams])
```

### Parameters
`url`
> A string that corresponds with the URL slug of a webpage to be monitored.

`captureParams`
> A boolean specifying whether to capture and monitor `?prop=value` parameters within the URL. If not specified, `captureParams` will defualt to `false`.

## `Url` prototype object
### Properties
[`Url.value`](value.md)
> A string corresponding to the full URL of the target page.

`Url.active`
> A boolean representing the load state of the target page. True if the current page is the one being monitored, false otherwise.

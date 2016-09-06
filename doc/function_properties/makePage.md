# makePage()
The `makePage()` function converts an existing 404 page into a custom page for content.

## Syntax
```
makePage(slug, title[, pageTitle], content)
```

### Parameters
`slug`
> A string representing the URL slug to target for replacement

`title`
> A string representing the title of the `<h1>` heading on the page.

`pageTitle`
> A string, if specified, that defines the title of the page as represented in the `<title>` tag. If omitted, defaults to the same value as `title`.

`content`
> The HTML-formatted content to be displayed in the page.

## Return value
When used to create a custom page, `makePage()` returns a boolean value representing whether the current page is the page that is being targeted.

If the arguments are not of the proper type, `makePage()` will instead return `undefined`.

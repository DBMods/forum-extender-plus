# showModal() options.heightMod
Defines the elements within the modal used as a reference for size manipulation.

| Property | Summary |
| --- | --- |
| Type | String array |
| Length | 2 |
| Required | No |
| Default value | `undefined` |

## Syntax
```javascript
heightMod: [actionElem, actionTwoElem]
```

### Parameters
`actionElem`
> A string representing the CSS selector of the item to be used to modify height on the trigger of `Action`-type elements.

`actionTwoElem`
> A string representing the CSS selector of the item to be used to modify height on the trigger of `ActionTwo`-type elements.

## Description
`heightMod` is a string array of length 2, where the strings are valid CSS selectors an item to be used in dynamic height resizing. In the event that the height of the modal needs to be dynamic, the height of the matched element is used to determine the new height of the modal. Typically, `heightMod` would be used in modals that have dynamic content, such as creating a list.

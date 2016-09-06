# showModal()
The `showModal()` function displays an interactive modal window to the user with given content, options, and actions.

## Syntax
```
showModal(options)
```

### Parameters
`options`
> An object containing parameters for configuring the modal and its actions.

### Object properties
[`button`](buttons.md)
> A required string array representing the list of buttons to appear on the modal.

[`title`](title.md)
> A required string representing the title of the modal.

[`content`](content.md)
> A required HTML-formatted string representing the contents of the modal.

[`dimm`](dimm.md)
> An integer array representing custom pixel dimensions.

[`init()`](init.md)
> A function defining an action or series of actions to be run once the modal is created.

[`action()`](action.md)
> A function defining an action or series of actions to be run on the press of `Action`-type buttons.

[`actionTwo()`](actionTwo.md)
> A function defining an action or series of actions to be run on the press of `ActionTwo`-type buttons.

[`heightMod`](heightMod.md)
> A string array representing CSS selectors of elements to be used in determining dynamic height resizing.

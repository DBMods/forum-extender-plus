# showModal() options.init()
The `init()` function defines a custom action to be run when the modal is created.

| Property | Summary |
| --- | --- |
| Type | Function |
| Required | No |
| Default value | `undefined` |

## Syntax
```javascript
init: function() {
  //Code to run when modal is created
}
```

**Note:** The `init()` function does not get passed any parameters.

## Description
The `init()` function allows a custom action to be run upon creation of the modal. Since in most cases, this can also be done when the `showModal()` function is called, `init()` is typically used for handing events specific to the modal itself, such as loading a user's saved form values, which can only be done after the modal is created.

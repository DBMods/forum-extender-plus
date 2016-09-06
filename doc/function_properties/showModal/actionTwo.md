# showModal() options.actionTwo()
The `actionTwo()` function defines a custom action to be associated with buttons of type `ActionTwo`.

| Property | Summary |
| --- | --- |
| Type | Function |
| Required | No |
| Default value | `undefined` |

## Syntax
```javascript
actionTwo: function() {
  //Code to run when "Action" type buttons are clicked
}
```

**Note:** The `actionTwo()` function does not get passed any parameters.

## Description
The `actionTwo()` function defines a function to be bound to the click of buttons with the `ActionTwo` type. Unlike `action()`, `actionTwo()` is run as an intermediate action before closing the modal, such as adding an item to a list that's being created in the modal.

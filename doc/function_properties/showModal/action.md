# showModal() options.action()
The `action()` function defines a custom action to be associated with buttons of type `Action`.

| Property | Summary |
| --- | --- |
| Type | Function |
| Required | No |
| Default value | `undefined` |

## Syntax
```javascript
action: function() {
  //Code to run when "Action" type buttons are clicked
}
```

**Note:** The `action()` function does not get passed any parameters.

## Description
The `action()` function defines a function to be bound to the click of buttons with the `Action` type. Typically, `action()` is run when the user is done with  the modal and is closing it for some result, such as saving something, or confirming a dialog.

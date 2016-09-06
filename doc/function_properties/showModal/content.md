# showModal() options.content
Defines the modal's content that the user can view and/or interact with.

| Property | Summary |
| --- | --- |
| Type | String |
| Required | Yes |
| Default value | `undefined` |

## Description
`content` is an HTML-formatted string that defines the contents of the modal window that the user sees.

`content` is a required property of the `options` parameter. If no `content` property is defined, or it is defined incorrectly, `showModal()` will return `undefined`, and a log statement will warn about missing parameters.

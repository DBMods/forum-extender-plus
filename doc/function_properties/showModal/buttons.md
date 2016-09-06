# showModal() options.buttons
Defines the action buttons to appear on the modal.

| Property | Summary |
| --- | --- |
| Type | String array |
| Required | Yes |
| Default value | `undefined` |

## Description
`buttons` is a required property of the `options` parameter. If no `buttons` property is defined, or it is defined incorrectly, `showModal()` will return `undefined`, and a log statement will warn about missing parameters.

## Button action types
| Type | Action |
| --- | --- |
| `Action` | Primary action as defined by [`action()`](action.md) |
| `ActionTwo` | Secondary action if defined by [`actionTwo()`](actionTwo.md) |
| `CloseLink` | The same action taken by clicking outside of the modal, or by clicking the X in the top right corner |

## Default buttons
| Name | Action Type | Exceptions |
| --- | --- | --- |
| Add | `Action` | If an `OK` button also exists, action will be `ActionTwo` instead
| Cancel | `CloseLink` | No exceptions |
| Close | `CloseLink` | No exceptions |
| No | `CloseLink` | No exceptions |
| OK | `Action` | No exceptions |
| Send | `Action` | No exceptions |
| Yes | `Action` | No exceptions |

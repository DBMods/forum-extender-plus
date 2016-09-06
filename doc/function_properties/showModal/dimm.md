# showModal() options.dimm
Defines the modal's dimensions in pixels.

| Property | Summary |
| --- | --- |
| Type | Integer array |
| Length | 2 |
| Required | No |
| Default value | `[200, 408]` |

## Syntax
```javascript
dimm: [height, width]
```
### Parameters
`height`
> An integer representing the height of the modal in pixels.

`width`
> An integer representing the width of the modal in pixels.

## Description
`dimm` allows for custom sizing of modal windows. If no `dimm` property is specified, `showModal()` will use the default values.

# highlightPost()
The `highlightPost()` function highlights posts in a thread that meet a given criteria so that they show in a given color.

## Syntax
```
highlightPost(check, color[, label[, threshold]])
```

### Parameters

`check`
> The criteria to check for. It can be either a string, or a number. If `check` is a string, it will be used as an element selector to select those posts matching the criteria. If it is a number, it will select only those posts by people who have made at least that many posts.

`color`
> A string representing a color to highlight the selected posts in.

`label`
> A string to specify a name for the matched group of posts. If specified, it will be used to display highlight status to the user. If omitted, no message is displayed.

`threshold`
> A number between 0 and 1. If specified, it serves as an upper cutoff for the amount of matched posts. Highlighting will be disabled if the percentage of posts on the page that are matched exceeds this threshold. If omitted, highlighting is always enabled.

# highlightThread()
The `highlightThread()` function highlights threads in a list with the specified number of posts in a given color

## Syntax
```
highlightThread(postCount, color)
highlightThread(minPosts, maxPosts, color)
```

### Parameters

`postCount`
> An integer representing the number of posts a thread must have to be matched.

`minPosts`
> An integer representing the minimum number of posts a thread must have to be matched. `minPosts` is used in conjunction with `maxPosts`.

`maxPosts`
> An integer representing the maximum number of posts a thread can have to be matched. `maxPosts` is used in conjunction with `minPosts`.

`color`
> A string representing the color to highlight the matched threads with.

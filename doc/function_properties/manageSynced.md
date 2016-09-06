# manageSynced()
The `manageSynced()` function manages the known sync state of the user's changes through the Dropbox API.

## Syntax
```
manageSynced(synced)
```

### Parameters
`synced`
> A boolean representing whether the curremt action is finished working with the API.

## Description
The `manageSynced()` function manages the known sync state of the API via the use of an internal counter. The counter keeps track of the number of application tasks currently syncing, and is incremented when `manageSynced()` is passed `false`, and decremented when it's passed `true`. If the counter reaches `0`, it is known that no tasks are currently syncing changes via the API, and thus, the entire application is synced.

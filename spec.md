# Movie Manager

## Current State
A movie management app ("Cinematheque") with:
- Dashboard page showing stats and recent movies
- Collection page with search, filter, sort, add/edit/delete movies
- Movie types: title, year, genre, director, rating, description, watchStatus
- No authentication -- all users can access everything

## Requested Changes (Diff)

### Add
- Internet Identity login page (login screen shown to unauthenticated users)
- "My Watchlist" page: shows movies with watchStatus = Watchlist
- "Statistics" page: charts/stats showing genre breakdown, rating distribution, watched vs unwatched counts
- User-specific movie data: each logged-in user manages their own movie collection
- Logout button in header

### Modify
- App routing: gate all pages behind login; show login screen if not authenticated
- Header: add user identity indicator and logout button
- Backend: associate movies with caller principal so each user has their own collection
- Movie queries: filter by caller so users only see their own movies

### Remove
- Nothing removed

## Implementation Plan
1. Add authorization component (Internet Identity)
2. Regenerate backend with principal-scoped movie storage
3. Frontend: Add LoginPage component using Internet Identity auth hook
4. Frontend: Gate App behind auth check -- show LoginPage if not logged in
5. Frontend: Add WatchlistPage showing Watchlist movies
6. Frontend: Add StatisticsPage with genre/rating/status breakdown charts
7. Frontend: Update header with user avatar/identity and logout button
8. Frontend: Wire auth throughout (login/logout flow)

# Leaderboard And Status

## Routes

- `/leaderboard`
- `/status`

## Leaderboard

The leaderboard page is powered by `LeaderboardTable`.

### API dependencies

- `GET /api/leaderboard?category=overall&limit=20`
- `GET /api/leaderboard/trending`

### Current behavior

- Users can toggle between `overall` and `trending`
- Rows show score, Sharpe ratio, win rate, purchase count, and badge count
- Strategy links route back to strategy detail pages

### Limitation

- Snapshot generation logic exists, but scheduled refresh is not fully wired, so freshness depends on how leaderboard data is populated

## Status

The status page is powered by `StatusDashboard`.

### API dependency

- `GET /api/health`

### Current behavior

- Polls every 30 seconds
- Derives an overall status from the API health result
- Displays inferred rows for D1, Workers AI, Backtest Worker, and X Layer

### Limitation

- This is a lightweight runtime poller, not a historical uptime system
- Some non-API service rows are inferred rather than independently probed

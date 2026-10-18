# Running AI-Trader on Windows

This fork adds the Windows-compatibility fixes upstream lacks. The only
supported path is native Windows Python + Node — no WSL or Docker needed.

## Backend

```powershell
cd service\server
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ..\requirements.txt
copy ..\.env.example .env   # fill in your keys
uvicorn main:app --host 127.0.0.1 --port 8000
```

Notes:

- The worker's singleton lock uses `msvcrt` on Windows instead of `fcntl`,
  and defaults to `%TEMP%\ai-trader-worker.lock`. Override with
  `AI_TRADER_WORKER_LOCK_FILE` if you want it elsewhere.
- Generated file names (exports, logs) are sanitized: characters Windows
  forbids — notably `:` from ISO-8601 timestamps like `2026-10-18T08:00:00Z`
  — are replaced with `-`.

## Frontend

```powershell
cd service\frontend
npm install
npm run build   # postbuild permission fix is a no-op on Windows
npm run dev
```

## Keeping the fork current

`.github/workflows/sync-upstream.yml` rebases this fork's `main` onto
`HKUDS/AI-Trader` every night at 06:00 UTC (and on demand from the Actions
tab). If a rebase conflicts, it opens an issue instead of pushing.

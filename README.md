# Element-Web Day-Search Snippet

Quick console helper that lists **every text message** (in **all rooms**) which was sent on a single calendar day — no exports, no bots, no server round-trips.

## Usage

1. Open [Element-Web](https://app.element.io) and wait until the spinner disappears.
2. Press `F12` → Console.
3. Paste the script below, change the date if you want, press `Enter`.

```js
(() => {
  const TARGET_DAY = '2026-02-02';      // ←-- change me
  const DAY_START  = +new Date(TARGET_DAY);
  const DAY_END    = DAY_START + 86400000; // +24 h

  const cli =
    window.matrixChat?.matrixClient || window.mxMatrixClientPeg?.get?.();
  if (!cli) {
    console.warn('Matrix client not ready – open any room and retry.');
    return;
  }

  const hits = [];

  cli.getRooms().forEach(room => {
    (room.timeline || []).forEach(event => {
      const ts = event.getTs();
      if (ts >= DAY_START && ts < DAY_END) {
        hits.push({
          room : room.name || room.roomId,
          time : new Date(ts).toISOString(),
          from : event.sender?.name || event.getSender(),
          body : event.getContent().body || '<encrypted / no body>'
        });
      }
    });
  });

  console.table(hits);
  console.log(`${hits.length} messages on ${TARGET_DAY}`);
})();

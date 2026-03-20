/*
 * -------------------------------------------------------------
 * Element-Web "search-by-day" snippet
 * -------------------------------------------------------------
 * Lists every text message (in any room) that was sent on
 * one specific calendar day (local browser timezone).
 * No exports, no add-ons – just F12 → Console → paste → Enter.
 * -------------------------------------------------------------
 */

(() => {
  /* ****** CONFIG ****** */
  const TARGET_DAY = '2026-02-02';      // <— change to desired date
  const DAY_START  = +new Date(TARGET_DAY);
  const DAY_END    = DAY_START + 86400000; // +24 h
  /* ******************** */

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

  /* ****** OUTPUT ****** */
  console.table(hits);
  console.log(`${hits.length} messages on ${TARGET_DAY}`);
})();

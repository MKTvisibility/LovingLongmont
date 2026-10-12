function townDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = name => parts.find(p => p.type === name).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
function addTownDays(date, days) {
  const value = new Date(date + 'T12:00:00Z');
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
function pickTownEvents(events, filter, today = townDate()) {
  const day = new Date(today + 'T12:00:00Z').getUTCDay();
  const friday = addTownDays(today, day === 0 ? -2 : day === 6 ? -1 : (5 - day + 7) % 7);
  const sunday = addTownDays(friday, 2);
  return events.filter(event => {
    if (event.date < today) return false;
    if (filter === 'today') return event.date === today;
    if (filter === 'weekend') return event.date >= friday && event.date <= sunday;
    if (filter === 'family') return event.free && event.family;
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));
}
if (typeof document !== 'undefined') {
  const dialog = document.getElementById('planned-page-dialog');
  document.querySelectorAll('[data-pending-route]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    document.getElementById('planned-page-title').textContent = link.dataset.title;
    document.getElementById('planned-page-message').textContent = 'This dedicated page is planned and has not been created yet. You can browse related content in our existing town guide.';
    document.getElementById('planned-page-path').textContent = 'Planned route: /' + link.dataset.pendingRoute;
    document.getElementById('planned-page-alternative').href = link.dataset.alternative;
    dialog.showModal();
  }));
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  const results = document.getElementById('local-event-results');
  const buttons = [...document.querySelectorAll('[data-event-filter]')];
  let events = [];
  function renderEvents(filter) {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.eventFilter === filter)));
    results.replaceChildren();
    const matches = pickTownEvents(events, filter).slice(0, 3);
    if (!matches.length) {
      const empty = document.createElement('p'); empty.className = 'st-event-empty';
      empty.append('No matching events are listed for this filter. ');
      const link = document.createElement('a'); link.href = 'events.html'; link.textContent = 'Browse the full calendar →'; empty.append(link); results.append(empty); return;
    }
    matches.forEach(event => {
      const card = document.createElement('article'); card.className = 'st-event-card';
      const date = document.createElement('div'); date.className = 'st-date';
      const value = new Date(event.date + 'T12:00:00Z'); date.append(value.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }));
      const day = document.createElement('strong'); day.textContent = String(value.getUTCDate()); date.append(day);
      const body = document.createElement('div'); const title = document.createElement('h3'); title.textContent = event.title;
      const copy = document.createElement('p'); copy.textContent = event.description;
      const link = document.createElement('a'); link.href = event.url || 'events.html'; link.textContent = 'Event details →';
      if (event.url) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      body.append(title, copy, link); card.append(date, body); results.append(card);
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => renderEvents(button.dataset.eventFilter)));
  fetch('assets/events.json').then(response => { if (!response.ok) throw new Error('Event data unavailable'); return response.json(); }).then(data => { events = data; renderEvents('upcoming'); }).catch(() => {
    results.replaceChildren(); const copy = document.createElement('p'); copy.className = 'st-event-empty'; copy.append('The event preview could not load. '); const link = document.createElement('a'); link.href = 'events.html'; link.textContent = 'Open the community calendar →'; copy.append(link); results.append(copy);
  });
}

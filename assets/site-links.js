function applyExternalLinkPolicy(link) {
  const url = new URL(link.href, window.location.href);
  if ((url.protocol === 'https:' || url.protocol === 'http:') && url.origin !== window.location.origin) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
}
document.querySelectorAll('a[href]').forEach(applyExternalLinkPolicy);
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (link) applyExternalLinkPolicy(link);
});
document.querySelectorAll('.sb-mobile-links a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('.sb-mobile').open = false;
}));

/**
 * The site is static, so the contact form opens the visitor's mail app with
 * the message pre-filled instead of posting to a server.
 */
export function initContactForm() {
  const form = document.getElementById('ntContactForm') as HTMLFormElement | null;
  const notice = document.getElementById('ntContactNotice');
  if (!form) return;
  const to = form.dataset.email ?? '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const subject = String(data.get('subject') ?? '').trim() || `Project inquiry from ${name}`;
    const message = String(data.get('message') ?? '').trim();
    const body = `${message}\n\n— ${name} <${email}>`;

    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (notice) {
      notice.className = 'mp-contact__notice mp-contact__notice--ok';
      notice.innerHTML =
        '<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Your email app should open with the message ready to send. If it doesn\'t, write to me directly at <a href="mailto:' +
        to +
        '">' +
        to +
        '</a>.</span>';
      notice.hidden = false;
    }
  });
}

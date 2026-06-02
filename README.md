### HW2

### HW3 Portfolio
Am adăugat `portfolio.html`, o pagină nouă cu header, navigație, skip link și structură semantică.
Formularul are controale accesibile: text, textarea, url, select, date și checkbox, cu `label`, `fieldset`, `legend` și mesaje de eroare vizibile.
Validarea este făcută în `portfolio.js`, blochează trimiterea când apar erori și golește formularul după salvare.
Proiectele sunt afișate într-un tabel accesibil, cu `caption`, antete cu `scope`, wrapper responsive și miniaturi pentru imagini.
Linkul către pagină a fost adăugat în navigația tuturor paginilor principale.

### Validation
HTML/CSS/JS syntax checks: passed locally.
Lighthouse audit: not run in this environment because Node.js/npm are not installed here.
Record the final published scores here after running Lighthouse on GitHub Pages:
	- Performance: pending
	- Accessibility: pending
	- Best Practices: pending
	- SEO: pending

### Notes
Limita curentă este lipsa instrumentelor Lighthouse în mediul local.
Recomandarea este să rulezi auditul după publicarea pe GitHub Pages și să înlocuiești valorile `pending` cu scorurile reale.

Modificări principale:
- `card.html`: am folosit `assets/card-avatar.png`.
- `card.css`: avatar rotund 140×140px, `object-fit: cover`, centrăm conținutul și avem zoom la hover.
- `chatbot.js`: trimitere automata când se apasă o întrebare sugerată.

Limitări:
- Bază locală de întrebări
- Conversațiile nu sunt păstrate între sesiuni.



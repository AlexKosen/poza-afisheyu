(() => {
  const views = [...document.querySelectorAll('[data-view]')];
  const nav = document.querySelector('.primary-nav');
  const menu = document.querySelector('.menu-toggle');

  const articles = {
    'article-sector': 'sector',
    'article-metod': 'metod',
    'article-interview': 'interview',
    'article-lekoc': 'naboka',
    'article-book': 'book'
  };

  function addArticleText(view, key) {
    const paragraphs = window.ARTICLE_CONTENT?.[key];
    const article = view.querySelector('.article');
    if (!paragraphs?.length || !article) return;
    const title = paragraphs[0];
    article.querySelector('h1').textContent = title;
    const content = article.querySelector('.article-content');
    const photoSets = {
      metod: [
        ['assets/photos/metod-1.jpg', 'Сценічний кадр із вистави «Метод 46».'],
        ['assets/photos/metod-2.jpg', 'Сцена вистави у світлі прожекторів.'],
        ['assets/photos/metod-3.jpg', 'Епізод вистави «Метод 46».']
      ],
      naboka: [
        ['assets/photos/naboka-1.jpg', 'Микола Набока під час лекції про педагогіку Жака Лекока.'],
        ['assets/photos/naboka-2.jpg', 'Учасники слухають лекцію про театр і рух.'],
        ['assets/photos/naboka-3.jpg', 'Схема з лекційної презентації.']
      ]
    };
    const photos = photoSets[key];
    if (photos) {
      const gallery = document.createElement('div');
      gallery.className = 'article-gallery';
      gallery.setAttribute('aria-label', 'Фотографії до статті');
      for (const [src, caption] of photos) {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = src;
        image.alt = caption;
        image.loading = 'lazy';
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = caption;
        figure.append(image, figcaption);
        gallery.append(figure);
      }
      article.insertBefore(gallery, content);
    }
    const related = [...content.querySelectorAll('.related-card')];
    content.replaceChildren();
    for (const [index, rawText] of paragraphs.slice(1).entries()) {
      const value = rawText.trim();
      if (!value) continue;
      if (value.toLocaleUpperCase('uk') === 'ДЖЕРЕЛА') {
        const heading = document.createElement('h2');
        heading.className = 'source-heading';
        heading.textContent = value;
        content.append(heading);
        continue;
      }
      const paragraph = document.createElement('p');
      if (value.startsWith('––')) {
        paragraph.className = 'interview-turn';
        paragraph.textContent = value.replace(/^––\s*/, '');
      } else if (key === 'interview' && index === 0 && value.startsWith('Фото')) {
        paragraph.className = 'photo-credit';
        paragraph.textContent = value;
      } else {
        paragraph.textContent = value;
      }
      content.append(paragraph);
    }
    related.forEach((card) => content.append(card));
  }

  const interviewView = document.createElement('div');
  interviewView.className = 'view article-view';
  interviewView.dataset.view = 'article-interview';
  interviewView.innerHTML = '<article class="article"><a class="back-link" href="#publications">← Усі публікації</a><p class="eyebrow">Інтерв’ю · 2026</p><h1></h1><p class="article-deck">Розмова про акторську роботу, режисуру, виставу «21» і незалежні театральні ініціативи.</p><div class="article-cover cover-blue"><span>ПА / 05</span><b>РОЗМОВА</b><small>ІНТЕРВ’Ю · 2026</small></div><div class="article-content"></div></article></div>';
  document.querySelector('main').append(interviewView);
  views.push(interviewView);
  Object.entries(articles).forEach(([viewName, key]) => {
    const view = views.find((item) => item.dataset.view === viewName);
    if (view) addArticleText(view, key);
  });
  const interviewGroup = [...document.querySelectorAll('.pub-group')]
    .find((group) => group.querySelector('h2')?.textContent.trim() === 'Інтерв’ю — скоро');
  if (interviewGroup) {
    interviewGroup.innerHTML = '<h2>Інтерв’ю</h2><a class="pub-row" href="#article-interview"><span class="pub-kind">Інтерв’ю</span><span><b>Інтерв’ю з Катериною (Вишнею) Вишневою</b><small>Про акторську роботу, режисуру та виставу «21».</small></span><span class="row-arrow">↗</span></a>';
  }
  const mainReview = document.querySelector('.feature-main h3');
  if (mainReview) mainReview.textContent = window.ARTICLE_CONTENT?.metod?.[0] || mainReview.textContent;
  const lectureCard = document.querySelector('.feature-grid .feature-card:nth-child(2) h3');
  if (lectureCard) lectureCard.textContent = window.ARTICLE_CONTENT?.naboka?.[0] || lectureCard.textContent;
  const reviewListing = document.querySelector('[data-view="publications"] .pub-group .pub-row b');
  if (reviewListing) reviewListing.textContent = window.ARTICLE_CONTENT?.metod?.[0] || reviewListing.textContent;

  function showRoute() {
    const route = location.hash.replace(/^#/, '') || 'home';
    const target = views.find((view) => view.dataset.view === route);
    const active = target || views.find((view) => view.dataset.view === 'home');
    views.forEach((view) => {
      const visible = view === active;
      view.classList.toggle('active', visible);
      view.setAttribute('aria-hidden', String(!visible));
    });
    document.title = active.dataset.view === 'home'
      ? 'Поза афішею — незалежний театр Києва'
      : `${active.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim() || 'Поза афішею'} — Поза афішею`;
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  window.addEventListener('hashchange', showRoute);
  showRoute();
})();

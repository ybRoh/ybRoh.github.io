/**
 * ybRoh GitHub Projects - Landing Page JS
 */

(function () {
    'use strict';

    var LANG_COLORS = {
        'Python': { color: '#3572A5', bg: '#EEF0FA' },
        'C++': { color: '#f34b7d', bg: '#FDEEF3' },
        'C': { color: '#555555', bg: '#F0F0F0' },
        'JavaScript': { color: '#f1e05a', bg: '#FFFDE7' },
        'TypeScript': { color: '#3178c6', bg: '#E8F0FE' },
        'HTML': { color: '#e34c26', bg: '#FDE8E0' },
        'CSS': { color: '#563d7c', bg: '#F0EBF8' },
        'Java': { color: '#b07219', bg: '#F8F0E0' },
        'Go': { color: '#00ADD8', bg: '#E0F7FA' },
        'Rust': { color: '#dea584', bg: '#FFF3E0' },
        'Shell': { color: '#89e051', bg: '#F1F8E9' }
    };
    var DEFAULT_LANG_COLOR = { color: '#6A6D70', bg: '#F7F7F7' };

    // 비공개 저장소 다운로드 비밀번호 (Base64)
    var PW_HASH = 'eWJSb2g=';

    // --- 모바일 햄버거 메뉴 ---
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        nav.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // --- 앵커 스무스 스크롤 ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            var headerHeight = document.getElementById('header').offsetHeight;
            var pos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        });
    });

    // --- 헤더 스크롤 효과 ---
    var header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.style.boxShadow = window.scrollY > 10
                ? '0 2px 12px rgba(0,0,0,0.25)'
                : '0 2px 8px rgba(0,0,0,0.15)';
        });
    }

    // --- 유틸 ---
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    function formatSize(kb) {
        if (!kb) return '';
        if (kb >= 1024) return (kb / 1024).toFixed(1) + ' MB';
        return kb + ' KB';
    }

    function formatDate(dateStr) {
        var d = new Date(dateStr);
        return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    }

    // --- 비밀번호 모달 ---
    var pendingDownloadUrl = '';
    var modal = document.getElementById('pw-modal');
    var pwInput = document.getElementById('pw-input');
    var pwError = document.getElementById('pw-error');
    var pwConfirm = document.getElementById('pw-confirm');
    var pwCancel = document.getElementById('pw-cancel');

    function showPwModal(url) {
        pendingDownloadUrl = url;
        pwInput.value = '';
        pwError.textContent = '';
        modal.classList.add('visible');
        pwInput.focus();
    }

    function hidePwModal() {
        modal.classList.remove('visible');
        pendingDownloadUrl = '';
    }

    if (pwCancel) pwCancel.addEventListener('click', hidePwModal);
    if (modal) modal.addEventListener('click', function (e) {
        if (e.target === modal) hidePwModal();
    });

    if (pwConfirm) pwConfirm.addEventListener('click', function () {
        var input = pwInput.value;
        if (btoa(input) === PW_HASH) {
            window.open(pendingDownloadUrl, '_blank');
            hidePwModal();
        } else {
            pwError.textContent = '비밀번호가 올바르지 않습니다.';
            pwInput.value = '';
            pwInput.focus();
        }
    });

    if (pwInput) pwInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') pwConfirm.click();
    });

    // 전역에서 접근 가능하도록
    window._showPwModal = showPwModal;

    // --- SVG 아이콘 ---
    var ICON_DOWNLOAD = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    var ICON_GITHUB = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
    var ICON_CODE = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
    var ICON_LOCK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>';
    var ICON_PUBLIC = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>';
    var ICON_STAR = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

    // --- 프로젝트 로드 ---
    function loadProjects() {
        var gridEl = document.getElementById('project-grid');
        if (!gridEl) return;

        fetch('data/repos.json')
            .then(function (res) {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            .then(function (repos) {
                if (!repos.length) {
                    gridEl.innerHTML = '<div class="qna-empty">프로젝트가 없습니다.</div>';
                    return;
                }

                // Hero 배지
                var langs = [];
                repos.forEach(function (r) {
                    if (r.language && langs.indexOf(r.language) === -1) langs.push(r.language);
                });
                var badgesEl = document.getElementById('hero-badges');
                if (badgesEl) {
                    badgesEl.innerHTML = langs.map(function (l) {
                        return '<span class="badge">' + escapeHtml(l) + '</span>';
                    }).join('');
                }

                // Footer
                var footerList = document.getElementById('footer-repo-list');
                if (footerList) {
                    footerList.innerHTML = repos.map(function (r) {
                        return '<li><a href="' + escapeHtml(r.url) + '" target="_blank" rel="noopener">' + escapeHtml(r.name) + '</a></li>';
                    }).join('');
                }

                // 카드 렌더링
                var html = '';
                repos.forEach(function (repo) {
                    var lang = repo.language || 'Unknown';
                    var ls = LANG_COLORS[lang] || DEFAULT_LANG_COLOR;
                    var desc = repo.description || '';
                    var stars = repo.stars || 0;
                    var priv = repo.isPrivate;
                    var cardCls = priv ? 'product-card private-card' : 'product-card public-card';
                    var releaseUrl = repo.url + '/releases';

                    html += '<div class="' + cardCls + '">';
                    html += '<div class="product-card-header">';
                    html += '<div class="product-icon" style="background:' + ls.bg + ';color:' + ls.color + ';">' + ICON_CODE + '</div>';
                    html += '<div>';
                    html += '<h3 class="product-name">' + escapeHtml(repo.name) + '</h3>';
                    html += priv
                        ? '<span class="private-badge">' + ICON_LOCK + ' Private</span>'
                        : '<span class="public-badge">' + ICON_PUBLIC + ' Public</span>';
                    html += '</div></div>';
                    if (desc) html += '<p class="product-desc">' + escapeHtml(desc) + '</p>';
                    html += '<div class="product-meta">';
                    if (stars > 0) html += '<span class="meta-item">' + ICON_STAR + ' ' + stars + '</span>';
                    var sizeStr = formatSize(repo.sizeKB);
                    if (sizeStr) html += '<span class="meta-item">' + sizeStr + '</span>';
                    html += '<span class="meta-item">' + formatDate(repo.updatedAt) + ' 업데이트</span>';
                    html += '</div>';
                    html += '<div class="product-tech">';
                    if (lang !== 'Unknown') html += '<span class="tech-badge" style="background:' + ls.bg + ';color:' + ls.color + ';">' + escapeHtml(lang) + '</span>';
                    html += '</div>';
                    html += '<div class="product-actions">';
                    // 다운로드 버튼: private은 비밀번호, public은 직접 링크
                    if (priv) {
                        html += '<button class="btn btn-primary btn-sm" onclick="window._showPwModal(\'' + escapeHtml(releaseUrl) + '\')">' + ICON_DOWNLOAD + ' 다운로드</button>';
                    } else {
                        html += '<a href="' + escapeHtml(releaseUrl) + '" class="btn btn-primary btn-sm" target="_blank" rel="noopener">' + ICON_DOWNLOAD + ' 다운로드</a>';
                    }
                    html += '<a href="' + escapeHtml(repo.url) + '" class="btn btn-ghost btn-sm" target="_blank" rel="noopener">' + ICON_GITHUB + ' GitHub</a>';
                    html += '</div></div>';
                });

                gridEl.innerHTML = html;
            })
            .catch(function () {
                gridEl.innerHTML = '<div class="qna-error">프로젝트를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</div>';
            });
    }

    loadProjects();

    // --- Q&A ---
    var SPAM_KEYWORDS = [
        '광고', '홍보', '카지노', '대출', '도박', '성인', '비트코인', '코인',
        '투자', '부업', '클릭', '무료상담', '텔레그램', '카톡', '연락처',
        '수익', '재테크', '당일출금', '먹튀', '토토', '슬롯', '바카라',
        '로또', '배팅', '입금', '출금'
    ];

    function filterContent(text) {
        if (!text) return { safe: true, cleaned: '' };
        var cleaned = text.replace(/<\s*(script|iframe|img|object|embed|form|link|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
        cleaned = cleaned.replace(/<\s*(script|iframe|img|object|embed|form|link|style)[^>]*\/?>/gi, '');
        var urls = cleaned.match(/https?:\/\/[^\s]+/gi);
        if (urls) {
            for (var i = 0; i < urls.length; i++) {
                if (urls[i].indexOf('github.com/ybRoh') === -1)
                    return { safe: false, reason: '외부 URL이 포함되어 있습니다.' };
            }
        }
        var lower = cleaned.toLowerCase();
        for (var j = 0; j < SPAM_KEYWORDS.length; j++) {
            if (lower.indexOf(SPAM_KEYWORDS[j]) !== -1)
                return { safe: false, reason: '부적절한 키워드가 포함되어 있습니다: ' + SPAM_KEYWORDS[j] };
        }
        return { safe: true, cleaned: cleaned };
    }

    function loadQnA() {
        var listEl = document.getElementById('qna-list');
        if (!listEl) return;
        fetch('https://api.github.com/repos/ybRoh/ybRoh.github.io/issues?labels=qna&state=open&sort=created&direction=desc&per_page=20')
            .then(function (res) { if (!res.ok) throw new Error('API error'); return res.json(); })
            .then(function (issues) {
                if (!issues.length) { listEl.innerHTML = '<div class="qna-empty">아직 등록된 질문이 없습니다.</div>'; return; }
                var html = '';
                issues.forEach(function (issue) {
                    var tf = filterContent(issue.title), bf = filterContent(issue.body || '');
                    var title = tf.safe ? escapeHtml(issue.title) : '[부적절한 콘텐츠]';
                    var body = bf.safe ? escapeHtml(bf.cleaned || '') : '[부적절한 콘텐츠]';
                    html += '<a class="qna-item" href="' + escapeHtml(issue.html_url) + '" target="_blank" rel="noopener">';
                    html += '<div class="qna-item-title">' + title + '</div>';
                    html += '<div class="qna-item-meta">';
                    html += '<span><img src="' + escapeHtml(issue.user.avatar_url) + '" alt=""> ' + escapeHtml(issue.user.login) + '</span>';
                    html += '<span>' + formatDate(issue.created_at) + '</span>';
                    html += '<span>' + (issue.comments || 0) + '개의 답변</span></div>';
                    if (body) html += '<div class="qna-item-body">' + body + '</div>';
                    html += '</a>';
                });
                listEl.innerHTML = html;
            })
            .catch(function () { listEl.innerHTML = '<div class="qna-error">질문을 불러올 수 없습니다.</div>'; });
    }

    function initQnAForm() {
        var btn = document.getElementById('qna-submit');
        var titleIn = document.getElementById('qna-title');
        var bodyIn = document.getElementById('qna-body');
        if (!btn || !titleIn || !bodyIn) return;
        var warn = document.createElement('div');
        warn.className = 'qna-filter-warning';
        titleIn.parentNode.insertBefore(warn, titleIn);
        btn.addEventListener('click', function () {
            var t = titleIn.value.trim(), b = bodyIn.value.trim();
            warn.classList.remove('visible'); warn.textContent = '';
            if (!t || t.length < 5) { warn.textContent = '질문 제목을 5자 이상 입력해주세요.'; warn.classList.add('visible'); titleIn.focus(); return; }
            var tc = filterContent(t); if (!tc.safe) { warn.textContent = tc.reason; warn.classList.add('visible'); return; }
            var bc = filterContent(b); if (!bc.safe) { warn.textContent = bc.reason; warn.classList.add('visible'); return; }
            window.open('https://github.com/ybRoh/ybRoh.github.io/issues/new?labels=qna&title=' + encodeURIComponent(t) + '&body=' + encodeURIComponent(b), '_blank');
        });
    }

    loadQnA();
    initQnAForm();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) loadQnA(); });
})();

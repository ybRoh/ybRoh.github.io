/**
 * ybRoh GitHub Projects - Landing Page JS
 * - 모바일 햄버거 메뉴 토글
 * - 앵커 스무스 스크롤 (고정 헤더 offset 보정)
 * - GitHub API로 프로젝트 동적 로드
 * - Q&A (GitHub Issues 기반)
 */

(function () {
    'use strict';

    // --- 언어별 색상 매핑 (GitHub 컬러) ---
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

    // --- 모바일 햄버거 메뉴 ---
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        var navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // --- 앵커 스무스 스크롤 (고정 헤더 offset 보정) ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            var headerHeight = document.getElementById('header').offsetHeight;
            var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // --- 헤더 스크롤 시 배경 강화 ---
    var header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.25)';
            } else {
                header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            }
        });
    }

    // --- 유틸 함수 ---
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    function formatDate(dateStr) {
        var date = new Date(dateStr);
        var y = date.getFullYear();
        var m = String(date.getMonth() + 1).padStart(2, '0');
        var d = String(date.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + d;
    }

    // --- GitHub 프로젝트 동적 로드 ---
    function loadProjects() {
        var gridEl = document.getElementById('project-grid');
        if (!gridEl) return;

        fetch('data/repos.json')
            .then(function (response) {
                if (!response.ok) throw new Error('Failed to load repos');
                return response.json();
            })
            .then(function (filtered) {

                if (!filtered.length) {
                    gridEl.innerHTML = '<div class="qna-empty">공개된 프로젝트가 없습니다.</div>';
                    return;
                }

                // Hero 배지에 사용된 언어 표시
                var languages = [];
                filtered.forEach(function (repo) {
                    if (repo.language && languages.indexOf(repo.language) === -1) {
                        languages.push(repo.language);
                    }
                });
                var badgesEl = document.getElementById('hero-badges');
                if (badgesEl) {
                    badgesEl.innerHTML = languages.map(function (lang) {
                        return '<span class="badge">' + escapeHtml(lang) + '</span>';
                    }).join('');
                }

                // Footer 저장소 링크 업데이트
                var footerList = document.getElementById('footer-repo-list');
                if (footerList) {
                    var footerHtml = '';
                    filtered.forEach(function (repo) {
                        footerHtml += '<li><a href="' + escapeHtml(repo.url) + '" target="_blank" rel="noopener">' + escapeHtml(repo.name) + '</a></li>';
                    });
                    footerList.innerHTML = footerHtml;
                }

                // 프로젝트 카드 렌더링
                var html = '';
                filtered.forEach(function (repo) {
                    var lang = repo.language || 'Unknown';
                    var langStyle = LANG_COLORS[lang] || DEFAULT_LANG_COLOR;
                    var desc = repo.description || '';
                    var stars = repo.stars || 0;
                    var isPrivate = repo.isPrivate;

                    var cardClass = isPrivate ? 'product-card private-card' : 'product-card public-card';
                    html += '<div class="' + cardClass + '">';
                    html += '  <div class="product-card-header">';
                    html += '    <div class="product-icon" style="background: ' + langStyle.bg + '; color: ' + langStyle.color + ';">';
                    html += '      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
                    html += '    </div>';
                    html += '    <div>';
                    html += '      <h3 class="product-name">' + escapeHtml(repo.name) + '</h3>';
                    if (isPrivate) {
                        html += '      <span class="private-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Private</span>';
                    } else {
                        html += '      <span class="public-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> Public</span>';
                    }
                    html += '    </div>';
                    html += '  </div>';
                    if (desc) {
                        html += '  <p class="product-desc">' + escapeHtml(desc) + '</p>';
                    }
                    html += '  <div class="product-meta">';
                    if (stars > 0) {
                        html += '    <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ' + stars + '</span>';
                    }
                    html += '    <span class="meta-item">' + formatDate(repo.updatedAt) + ' 업데이트</span>';
                    html += '  </div>';
                    html += '  <div class="product-tech">';
                    if (lang !== 'Unknown') {
                        html += '    <span class="tech-badge" style="background: ' + langStyle.bg + '; color: ' + langStyle.color + ';">' + escapeHtml(lang) + '</span>';
                    }
                    html += '  </div>';
                    html += '  <div class="product-actions">';
                    html += '    <a href="' + escapeHtml(repo.url) + '" class="btn btn-ghost btn-sm" target="_blank" rel="noopener">';
                    html += '      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
                    html += '      GitHub';
                    html += '    </a>';
                    html += '  </div>';
                    html += '</div>';
                });

                gridEl.innerHTML = html;
            })
            .catch(function () {
                gridEl.innerHTML = '<div class="qna-error">프로젝트를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</div>';
            });
    }

    // 프로젝트 로드
    loadProjects();

    // --- Q&A: 콘텐츠 필터링 ---
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

        var urlPattern = /https?:\/\/[^\s]+/gi;
        var urls = cleaned.match(urlPattern);
        if (urls) {
            for (var i = 0; i < urls.length; i++) {
                if (urls[i].indexOf('github.com/ybRoh') === -1) {
                    return { safe: false, reason: '외부 URL이 포함되어 있습니다.' };
                }
            }
        }

        var lowerText = cleaned.toLowerCase();
        for (var j = 0; j < SPAM_KEYWORDS.length; j++) {
            if (lowerText.indexOf(SPAM_KEYWORDS[j]) !== -1) {
                return { safe: false, reason: '부적절한 키워드가 포함되어 있습니다: ' + SPAM_KEYWORDS[j] };
            }
        }

        return { safe: true, cleaned: cleaned };
    }

    // --- Q&A: 질문 목록 로드 ---
    function loadQnA() {
        var listEl = document.getElementById('qna-list');
        if (!listEl) return;

        var apiUrl = 'https://api.github.com/repos/ybRoh/ybRoh.github.io/issues?labels=qna&state=open&sort=created&direction=desc&per_page=20';

        fetch(apiUrl)
            .then(function (response) {
                if (!response.ok) throw new Error('API error');
                return response.json();
            })
            .then(function (issues) {
                if (!issues.length) {
                    listEl.innerHTML = '<div class="qna-empty">아직 등록된 질문이 없습니다.</div>';
                    return;
                }

                var html = '';
                issues.forEach(function (issue) {
                    var titleFilter = filterContent(issue.title);
                    var bodyFilter = filterContent(issue.body || '');

                    var displayTitle = titleFilter.safe ? escapeHtml(issue.title) : '[부적절한 콘텐츠]';
                    var displayBody = bodyFilter.safe ? escapeHtml(bodyFilter.cleaned || '') : '[부적절한 콘텐츠]';
                    var commentCount = issue.comments || 0;

                    html += '<a class="qna-item" href="' + escapeHtml(issue.html_url) + '" target="_blank" rel="noopener">';
                    html += '  <div class="qna-item-title">' + displayTitle + '</div>';
                    html += '  <div class="qna-item-meta">';
                    html += '    <span><img src="' + escapeHtml(issue.user.avatar_url) + '" alt=""> ' + escapeHtml(issue.user.login) + '</span>';
                    html += '    <span>' + formatDate(issue.created_at) + '</span>';
                    html += '    <span>' + commentCount + '개의 답변</span>';
                    html += '  </div>';
                    if (displayBody) {
                        html += '  <div class="qna-item-body">' + displayBody + '</div>';
                    }
                    html += '</a>';
                });

                listEl.innerHTML = html;
            })
            .catch(function () {
                listEl.innerHTML = '<div class="qna-error">질문을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</div>';
            });
    }

    // --- Q&A: 질문 등록 ---
    function initQnAForm() {
        var submitBtn = document.getElementById('qna-submit');
        var titleInput = document.getElementById('qna-title');
        var bodyInput = document.getElementById('qna-body');

        if (!submitBtn || !titleInput || !bodyInput) return;

        var warning = document.createElement('div');
        warning.className = 'qna-filter-warning';
        titleInput.parentNode.insertBefore(warning, titleInput);

        submitBtn.addEventListener('click', function () {
            var title = titleInput.value.trim();
            var body = bodyInput.value.trim();

            warning.classList.remove('visible');
            warning.textContent = '';

            if (!title || title.length < 5) {
                warning.textContent = '질문 제목을 5자 이상 입력해주세요.';
                warning.classList.add('visible');
                titleInput.focus();
                return;
            }

            var titleCheck = filterContent(title);
            if (!titleCheck.safe) {
                warning.textContent = titleCheck.reason;
                warning.classList.add('visible');
                return;
            }

            var bodyCheck = filterContent(body);
            if (!bodyCheck.safe) {
                warning.textContent = bodyCheck.reason;
                warning.classList.add('visible');
                return;
            }

            var issueUrl = 'https://github.com/ybRoh/ybRoh.github.io/issues/new?labels=qna'
                + '&title=' + encodeURIComponent(title)
                + '&body=' + encodeURIComponent(body);

            window.open(issueUrl, '_blank');
        });
    }

    // Q&A 초기화
    loadQnA();
    initQnAForm();

    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            loadQnA();
        }
    });
})();

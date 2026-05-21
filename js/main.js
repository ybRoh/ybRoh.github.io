/**
 * 자동차부품 제조 솔루션 - Landing Page JS
 * - 모바일 햄버거 메뉴 토글
 * - 앵커 스무스 스크롤 (고정 헤더 offset 보정)
 * - GitHub API 최신 릴리스 버전 표시
 */

(function () {
    'use strict';

    // --- 모바일 햄버거 메뉴 ---
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // 네비게이션 링크 클릭 시 메뉴 닫기
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

    // --- Q&A: 콘텐츠 필터링 ---
    var SPAM_KEYWORDS = [
        '광고', '홍보', '카지노', '대출', '도박', '성인', '비트코인', '코인',
        '투자', '부업', '클릭', '무료상담', '텔레그램', '카톡', '연락처',
        '수익', '재테크', '당일출금', '먹튀', '토토', '슬롯', '바카라',
        '로또', '배팅', '입금', '출금'
    ];

    function filterContent(text) {
        if (!text) return { safe: true, cleaned: '' };

        // HTML 태그 제거
        var cleaned = text.replace(/<\s*(script|iframe|img|object|embed|form|link|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
        cleaned = cleaned.replace(/<\s*(script|iframe|img|object|embed|form|link|style)[^>]*\/?>/gi, '');

        // 외부 URL 검사 (github.com/ybRoh 허용)
        var urlPattern = /https?:\/\/[^\s]+/gi;
        var urls = cleaned.match(urlPattern);
        if (urls) {
            for (var i = 0; i < urls.length; i++) {
                if (urls[i].indexOf('github.com/ybRoh') === -1) {
                    return { safe: false, reason: '외부 URL이 포함되어 있습니다.' };
                }
            }
        }

        // 광고성 키워드 검사
        var lowerText = cleaned.toLowerCase();
        for (var j = 0; j < SPAM_KEYWORDS.length; j++) {
            if (lowerText.indexOf(SPAM_KEYWORDS[j]) !== -1) {
                return { safe: false, reason: '부적절한 키워드가 포함되어 있습니다: ' + SPAM_KEYWORDS[j] };
            }
        }

        return { safe: true, cleaned: cleaned };
    }

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

        // 기존 경고 메시지 요소 생성
        var warning = document.createElement('div');
        warning.className = 'qna-filter-warning';
        titleInput.parentNode.insertBefore(warning, titleInput);

        submitBtn.addEventListener('click', function () {
            var title = titleInput.value.trim();
            var body = bodyInput.value.trim();

            // 경고 초기화
            warning.classList.remove('visible');
            warning.textContent = '';

            // 입력값 검증
            if (!title || title.length < 5) {
                warning.textContent = '질문 제목을 5자 이상 입력해주세요.';
                warning.classList.add('visible');
                titleInput.focus();
                return;
            }

            // 필터링 검사
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

            // GitHub Issues 생성 페이지로 이동
            var issueUrl = 'https://github.com/ybRoh/ybRoh.github.io/issues/new?labels=qna'
                + '&title=' + encodeURIComponent(title)
                + '&body=' + encodeURIComponent(body);

            window.open(issueUrl, '_blank');
        });
    }

    // Q&A 초기화
    loadQnA();
    initQnAForm();

    // 페이지 포커스 시 Q&A 새로고침 (GitHub에서 Issue 생성 후 돌아왔을 때)
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            loadQnA();
        }
    });

    // --- GitHub API로 최신 릴리스 버전 표시 ---
    var versionBadges = document.querySelectorAll('.version-badge[data-repo]');

    versionBadges.forEach(function (badge) {
        var repo = badge.getAttribute('data-repo');
        if (!repo) return;

        var apiUrl = 'https://api.github.com/repos/' + repo + '/releases/latest';

        fetch(apiUrl)
            .then(function (response) {
                if (!response.ok) throw new Error('No release');
                return response.json();
            })
            .then(function (data) {
                if (data.tag_name) {
                    badge.textContent = data.tag_name;
                }
            })
            .catch(function () {
                // 릴리스가 없거나 API 실패 시 기본 텍스트 유지
                badge.textContent = 'latest';
            });
    });
})();

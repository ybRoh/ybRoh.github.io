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

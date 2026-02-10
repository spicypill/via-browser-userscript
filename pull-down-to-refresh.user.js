// ==UserScript==
// @name         Global Pull To Refresh
// @namespace    spicypill
// @version      1.2
// @description  Pull down from top to refresh on any site
// @match        *://*/*
// @run-at       document-end
// ==/UserScript==

(function () {
    if (!('ontouchstart' in window)) return;

    var startY = 0;
    var currentY = 0;
    var pulling = false;
    var threshold = 80;
    var maxPull = 110;
    var arrow = null;

    function createArrow() {
        if (arrow) return;
        arrow = document.createElement('div');

        // Down arrow using borders
        arrow.style.position = 'fixed';
        arrow.style.top = '8px';
        arrow.style.left = '50%';
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.marginLeft = '0';
        arrow.style.borderLeft = '7px solid transparent';
        arrow.style.borderRight = '7px solid transparent';
        arrow.style.borderTop = '9px solid rgba(90,90,90,0.9)';
        arrow.style.transform = 'translateX(-50%) translateY(-24px)';
        arrow.style.transition = 'transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        arrow.style.willChange = 'transform';
        arrow.style.backfaceVisibility = 'hidden';
        arrow.style.zIndex = '2147483647';
        arrow.style.pointerEvents = 'none';

        document.documentElement.appendChild(arrow);
    }

    function setArrowOffset(offset) {
        if (!arrow) return;
        var limited = Math.min(offset, maxPull);
        var y = limited - 24;
        arrow.style.transform = 'translateX(-50%) translateY(' + y + 'px)';
    }

    function resetArrow() {
        if (!arrow) return;
        arrow.style.transform = 'translateX(-50%) translateY(-24px)';
    }

    function triggerRefresh() {
        if (arrow) {
            arrow.style.transform = 'translateX(-50%) translateY(0px)';
        }
        location.reload();
    }

    createArrow();

    window.addEventListener('touchstart', function (e) {
        if (window.scrollY === 0 && e.touches && e.touches.length === 1) {
            startY = e.touches[0].clientY;
            currentY = startY;
            pulling = true;
        } else {
            pulling = false;
        }
    }, false);

    window.addEventListener('touchmove', function (e) {
        if (!pulling) return;
        if (!e.touches || !e.touches.length) return;
        currentY = e.touches[0].clientY;
        var diff = currentY - startY;

        if (diff > 0) {
            setArrowOffset(diff * 0.6);
        } else {
            pulling = false;
            resetArrow();
        }
    }, false);

    window.addEventListener('touchend', function () {
        if (!pulling) return;
        pulling = false;
        var diff = currentY - startY;
        if (diff * 0.6 >= threshold) {
            triggerRefresh();
        } else {
            resetArrow();
        }
    }, false);
})();

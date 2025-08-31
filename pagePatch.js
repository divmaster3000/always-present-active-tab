(function patchPage() {
    try {
        const forceVisible = () => {
            try { Object.defineProperty(document, 'hidden', { get: () => false, configurable: true }); } catch {}
            try { Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true }); } catch {}
            try {
                const orig = Document.prototype.hasFocus;
                Object.defineProperty(Document.prototype, 'hasFocus', {
                    configurable: true,
                    value: function() { return true; }
                });
            } catch {}
        };
        forceVisible();

        const stopImm = (e) => e.stopImmediatePropagation();
        document.addEventListener('visibilitychange', stopImm, true);
        window.addEventListener('blur',  stopImm, true);
        window.addEventListener('focus', stopImm, true);

        const _docAdd = document.addEventListener.bind(document);
        document.addEventListener = function(type, listener, opts) {
            if (type === 'visibilitychange') return;
            return _docAdd(type, listener, opts);
        };
        const _winAdd = window.addEventListener.bind(window);
        window.addEventListener = function(type, listener, opts) {
            if (type === 'blur' || type === 'focus') return;
            return _winAdd(type, listener, opts);
        };

        const fire = (type, target = document) =>
            target.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
        setInterval(() => {
            fire('mousemove'); fire('keydown'); fire('focus', window);
        }, 60_000);

        setInterval(() => {
            if (document.hidden !== false || document.visibilityState !== 'visible') forceVisible();
        }, 2000);

        console.log('[FakeActive] installed (MAIN world)');
    } catch (e) { console.warn('[FakeActive] failed', e); }
})();
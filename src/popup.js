document.addEventListener('DOMContentLoaded', function() {
    let toggleButton = document.getElementById('toggleButton');

    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        let tab = tabs[0];
        let currentDomain = new URL(tab.url).hostname.trim().toLowerCase();

        browser.storage.local.get(Constant.FIRESCROLL_EXCLUDED_DOMAINS_OPTION_NAME).then(result => {
            let excludedDomains = result.firescrollExcludedDomains || [];
            let isExcluded = excludedDomains.indexOf(currentDomain) !== -1;

            toggleButton.textContent = isExcluded
                ? 'Show on current domain'
                : 'Hide on current domain';

            toggleButton.addEventListener('click', function() {
                let newExcludedDomains;
                if (isExcluded) {
                    newExcludedDomains = excludedDomains.filter(d => d !== currentDomain);
                } else {
                    newExcludedDomains = excludedDomains.concat([currentDomain]);
                }
                browser.storage.local.set({ firescrollExcludedDomains: newExcludedDomains }).then(() => {
                    let messageType = isExcluded ? 'FIRESCROLL_SHOW' : 'FIRESCROLL_HIDE';
                    browser.tabs.sendMessage(tab.id, { type: messageType }).catch(() => {});
                    window.close();
                });
            });
        });
    });
});

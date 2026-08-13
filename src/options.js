document.addEventListener('DOMContentLoaded', function() {
    let slowSpeedInput = document.getElementById('slowSpeedInput');
    let normalSpeedInput = document.getElementById('normalSpeedInput');
    let fastSpeedInput = document.getElementById('fastSpeedInput');
    let saveButton = document.getElementById('saveButton');
    let clearPositionsButton = document.getElementById('clearPositionsButton');
    let excludedDomainsInput = document.getElementById('excludedDomainsInput');
    let defaultSlowSpeedElement = document.querySelector(".slowSpeedDefaultValueElement");
    let defaultNormalSpeedElement = document.querySelector(".normalSpeedDefaultValueElement");
    let defaultFastSpeedElement = document.querySelector(".fastSpeedDefaultValueElement");

    defaultSlowSpeedElement.textContent = " (default: " + Constant.SPEED_SLOW_VALUE + ")";
    defaultNormalSpeedElement.textContent = " (default: " + Constant.SPEED_NORMAL_VALUE + ")";
    defaultFastSpeedElement.textContent = " (default: " + Constant.SPEED_FAST_VALUE + ")";

    browser.storage.local.get(Constant.FIRESCROLL_SLOW_SPEED_VALUE_OPTION_NAME).then(result => {
        slowSpeedInput.value = result.firescrollSlowSpeedValue || Constant.SPEED_SLOW_VALUE;
    });

    browser.storage.local.get(Constant.FIRESCROLL_NORMAL_SPEED_VALUE_OPTION_NAME).then(result => {
        normalSpeedInput.value = result.firescrollNormalSpeedValue || Constant.SPEED_NORMAL_VALUE;
    });

    browser.storage.local.get(Constant.FIRESCROLL_FAST_SPEED_VALUE_OPTION_NAME).then(result => {
        fastSpeedInput.value = result.firescrollFastSpeedValue || Constant.SPEED_FAST_VALUE;
    });

    browser.storage.local.get(Constant.FIRESCROLL_EXCLUDED_DOMAINS_OPTION_NAME).then(result => {
        let excludedDomains = result.firescrollExcludedDomains || [];
        excludedDomainsInput.value = excludedDomains.join('\n');
    });

    saveButton.addEventListener('click', function() {
        let slowSpeedValue = parseInt(slowSpeedInput.value);
        browser.storage.local.set({ firescrollSlowSpeedValue: slowSpeedValue });

        let normalSpeedValue = parseInt(normalSpeedInput.value);
        browser.storage.local.set({ firescrollNormalSpeedValue: normalSpeedValue });

        let fastSpeedValue = parseInt(fastSpeedInput.value);
        browser.storage.local.set({ firescrollFastSpeedValue: fastSpeedValue });

        let excludedDomains = excludedDomainsInput.value.split('\n').map(d => d.trim().toLowerCase()).filter(d => d.length > 0);
        browser.storage.local.set({ firescrollExcludedDomains: excludedDomains });
    });

    clearPositionsButton.addEventListener('click', function() {
        browser.storage.local.remove(Constant.FIRESCROLL_CONTAINER_POSITION);
    });
});
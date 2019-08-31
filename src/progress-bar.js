(function () {
    loadData();
})();

/**
 * Fetches data and loads dom based on data received.
 */
function loadData() {
    fetch('http://pb-api.herokuapp.com/bars')
        .then(response => response.json())
        .then(data => {
            // load select progress bars
            const selectEl = loadSelectProgressBars(data.bars);
            selectEl.addEventListener('change', (target) => {
                activeBar = parseInt(target.target.value);
            });

            loadProgressBars(data.bars);

            let activeBar = 0;

            data.buttons.sort().forEach((text) => {
                const buttonEl = createButton(text);
                buttonEl.addEventListener('click', (target) => {
                    calculateUpdate(activeBar, target);
                })
            });
        })
        .catch(err => {
            // TODO: Add server error logging
            console.error('[progress-bar]', err);
        })
}

/**
 * load dropdown and set the initial value as 1st bar
 * @param bars
 * @returns {Element}
 */
function loadSelectProgressBars(bars) {
    const selectEl = document.querySelector('.bar-select');
    bars.forEach((bar, index) => {
        selectEl.options.add(new Option(`Progress #${index + 1}`, index, index === 0));
    });

    return selectEl;
}

/**
 * Loads progress bars based on the data received.
 * @param bars
 */
function loadProgressBars(bars) {
    const progressBarsEl = document.querySelector('.progress-bars');

    bars.forEach((bar, index) => {
        const barEl = document.createElement('div');
        // barEl.innerText = 'sample'
        barEl.classList.add('progress-bar-container');
        //
        const innerBarEl = document.createElement('div');
        innerBarEl.classList.add(`js-variable-${index}`);
        innerBarEl.classList.add(`progress-bar-container__variable`);
        innerBarEl.classList.add(`variable--normal`);
        innerBarEl.innerText = `${bar}%`;
        innerBarEl.style.width = `${bar}%`;

        barEl.appendChild(innerBarEl);
        progressBarsEl.appendChild(barEl);
    });
}

/**
 * Creates increament and decreament buttons in sorted manner
 * @param text
 * @returns {HTMLButtonElement}
 */
function createButton(text) {
    const container = document.querySelector('.increment');

    const buttonEl = document.createElement('button');
    buttonEl.classList.add(...['btn', 'btn--primary']);
    buttonEl.innerText = text;
    container.appendChild(buttonEl);
    return buttonEl;
}

/**
 * Updates the screen based on current and calculated width
 * @param activeBar
 * @param target
 */
function calculateUpdate(activeBar, target) {
    const currentFactor = parseInt(target.currentTarget.innerText, 10);

    const progressBarVarEl = document.querySelector(`.js-variable-${activeBar}`);

    const currentWidth = parseInt(progressBarVarEl.style.width, 10);
    const calculatedWidth = currentFactor + currentWidth;
    if (calculatedWidth <= 0) {
        progressBarVarEl.style.width = 0;
        progressBarVarEl.innerText = `0%`;
        return;
    }

    if (calculatedWidth <= 100) {
        progressBarVarEl.classList.remove('variable--overloaded');
        progressBarVarEl.style.width = `${calculatedWidth}%`;
        progressBarVarEl.innerText = `${calculatedWidth}%`;
        return;
    }

    progressBarVarEl.classList.add('variable--overloaded');
    progressBarVarEl.style.width = '100%';
    progressBarVarEl.innerText = '100%';
}


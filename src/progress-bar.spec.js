describe('#progressBar', () => {
    let documentRef;
    beforeAll(() => {
        const response = {
            json: () => ({
                bars: [20, 30, 40],
                buttons: [-10, -5, 5, 50]
            })
        };
        fetch = jest.fn(() => Promise.resolve(response));
        // Set up our document body
        // TODO: take from the index.html
        documentRef = `<div class="progress-bars"><!--Container for progress bar button --></div>
            <div>
                <label for="bar-select">Choose a bar</label>
                <select name="bar-select" id="bar-select" class="bar-select">
                </select>
            </div>
        <div class="increment"><!--Container for increment button --></div>`;
        document.body.innerHTML = documentRef;
        require('./progress-bar');
    });

    test('loads the page', () => {
        // document loaded with content;
        expect(document.body.innerHTML).not.toBe(documentRef);
    });

    test('should load bars with correct percentage of progress', () => {
        expect(document.querySelectorAll('.progress-bar-container').length).toBe(3);
    });

    test('should load choose progress bar dropdown', () => {
        expect(document.querySelectorAll('option').length).toBe(3, 'dropdown');
    });

    test('should load increment/decrement button', () => {
        expect(document.querySelectorAll('button').length).toBe(4, 'button');
    });


    test('should update the bar#1 to 70% when clicked on increment button#4 - (50%)', () => {
        document.querySelectorAll('button')[3].click();
        expect(document.querySelector('.js-variable-0').innerText).toBe('70%');

    });

    test('should update the bar#1 to 100% when clicked on increment button#4 - (50%)', () => {
        document.querySelectorAll('button')[3].click();
        document.querySelectorAll('button')[3].click();
        expect(document.querySelector('.js-variable-0').innerText).toBe('100%');

        // should add overloaded class
        expect(Array.from(document.querySelector('.js-variable-0').classList).includes('variable--overloaded')).toBeTruthy();
    });

    test('should update the bar#2 from 30% to 25% when clicked on decrement button#2 - (-5%)', () => {
        expect(document.querySelector('.js-variable-1').innerText).toBe('30%');
        const selectEl = document.querySelector('select');
        selectEl.selectedIndex = 1;

        const event = new Event('change');
        selectEl.dispatchEvent(event);

        document.querySelectorAll('button')[1].click();
        expect(document.querySelector('.js-variable-1').innerText).toBe('25%');
    });

    test('should update the bar#2 to 0% when clicked on decrement button#1 - (-50%)', () => {
        document.querySelectorAll('button')[0].click();
        document.querySelectorAll('button')[0].click();
        document.querySelectorAll('button')[0].click();

        expect(document.querySelector('.js-variable-1').innerText).toBe('0%');
    });

});


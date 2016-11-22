class Spinner {
    constructor(el) {
        this.container = el;
    }

    start() {
        this.spinner = this._createSpinner();
        this.container.appendChild(this.spinner);
    }

    stop() {
        if (this.container.contains(this.spinner)) {
            this.container.removeChild(this.spinner);
        }
    }

    _createSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'Spinner';

        const img = document.createElement('img');
        img.src = 'img/loading.gif';

        const span = document.createElement('span');
        span.innerText = 'Loading...';

        spinner.appendChild(img);
        spinner.appendChild(span);
        return spinner;
    }
}
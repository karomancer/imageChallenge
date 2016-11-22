const WIDTH = 200;

class ImageGrid {
    // Takes in the html element it should render inside of and an instance of GoogleImageService
    // This probably won't change, hence why it's in the constructor
    constructor(el, gis) {
        this.gis = gis;
        this.container = el;
        this.items = [];

        // Index of current image in lightbox
        this.idx = 0;
        this.imageGrid = this._createImageGrid();
        this.lightBox = this._createLightBox();
    }

    loading() {
        this.container.removeChild(this.imageGrid);
        // I'm pretty sure this removes all references to children,
        // but I'm not 100% certain. 'removeChild' only removes from DOM
        this._createImageGrid();
    }

    openLightbox(item) {
        this.container.appendChild(this.lightBox);
        setTimeout(() => {
            this.lightBox.classList.add('open');
            this.changeImage(this.items.indexOf(item));
        }, 200);
    }

    closeLightbox() {
        this.lightBox.classList.remove('open');
        setTimeout(() => {
            this.container.removeChild(this.lightBox);
        }, 200);
    }

    changeImage(idx) {
        if (idx < 0) {
            throw new Error('Can\'t retrieve image.');
        }

        if (idx >= this.items.length - 1) {
            // TODO: Would fetch next batch, but I keep running out of API calls,
            // so it's a bit hard to test
        }
        // Ideally, the forward arrow would fetch next 25, which would add to list
        // as well
        const forwardArrow = this.lightBox.getElementsByClassName('forward')[0];
        if (idx >= this.items.length - 1) {
            forwardArrow.classList.add('hide');
        } else {
            forwardArrow.classList.remove('hide');
        }

        const item = this.items[idx];
        const img = this.lightBox.getElementsByClassName('ImageGrid-lightbox-image')[0];
        const p = this.lightBox.getElementsByTagName('p')[0];
        img.src = item.image.thumbnailLink;
        p.innerText = '"' + item.title + '"';
        this.idx = idx;

        const backArrow = this.lightBox.getElementsByClassName('back')[0];
        if (idx == 0) {
            backArrow.classList.add('hide');
        } else {
            backArrow.classList.remove('hide');
        }
    }

    // Takes in JSON representation of items retrieved
    // by search. Items expected to have a
    // [title <str>, displayLink <str>, mime <str>, image <obj>]
    render(items) {
        this.items = items;
        items.map(item => this.imageGrid.appendChild(this._createImage(item, WIDTH)));
        this.container.appendChild(this.imageGrid);
    }

    _createImage(item, width) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'ImageGrid-thumbnail';

        const img = document.createElement('img');
        img.src = item.image.thumbnailLink;
        img.addEventListener('click', this.openLightbox.bind(this, item));
        if (width) {
            img.width = width;
        }

        imgContainer.appendChild(img);
        return imgContainer;
    }

    _createImageGrid() {
        const imageGrid = document.createElement('div');
        imageGrid.className = 'ImageGrid';
        return imageGrid;
    }

    _createLightBox() {
        const lightBox = document.createElement('div');
        lightBox.className = 'ImageGrid-lightbox';

        const backdrop = document.createElement('div');
        backdrop.className = 'ImageGrid-lightbox-backdrop';
        backdrop.addEventListener('click', this.closeLightbox.bind(this));

        const backArrow = document.createElement('img');
        backArrow.src = 'img/back.svg';
        backArrow.className = 'ImageGrid-lightbox-arrow back';
        backArrow.addEventListener('click', this._goBack.bind(this));

        const forwardArrow = document.createElement('img');
        forwardArrow.src = 'img/forward.svg';
        forwardArrow.className = 'ImageGrid-lightbox-arrow forward';
        forwardArrow.addEventListener('click', this._goForward.bind(this));

        const img = document.createElement('img');
        const p = document.createElement('p');
        img.className = 'ImageGrid-lightbox-image';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'ImageGrid-lightbox-image-container';
        imgContainer.appendChild(img);
        imgContainer.appendChild(p);

        document.addEventListener('keyup', () => {
            // Only check for key events while lightbox is open
            if (!this.lightBox.classList.contains('open')) {
                return;
            }

            switch (event.keyCode) {
                case 39:
                    // Right arrow
                    this._goForward();
                    // These breaks are pretty unnecessary, but just for style
                    // hell why not.
                    break;
                case 37:
                    // Left arrow
                    this._goBack();
                    break;
                case 27:
                    // ESC key
                    this.closeLightbox();
                    break;
                default:

            }
        });

        [backdrop, backArrow, imgContainer, forwardArrow].map(i => lightBox.appendChild(i));
        return lightBox;
    }

    _goBack() {
        this.changeImage(this.idx - 1);
    }

    _goForward() {
        this.changeImage(this.idx + 1);
    }
};
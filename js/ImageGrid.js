const WIDTH = 200;

class ImageGrid {
    // Takes in the html element it should render inside of
    // This probably won't change, hence why it's in the constructor
    constructor(el) {
        this.container = el;
        this.items = [];
    }

    // Takes in JSON representation of items retrieved
    // by search. Items expected to have a
    // [title <str>, displayLink <str>, mime <str>, image <obj>]
    render(items) {
        this.items = items;
        items.map(item => this.container.appendChild(this._createImage(item)));
    }

    _createImage(item) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'ImageGrid-thumbnail';

        const img = document.createElement('img');
        img.src = item.image.thumbnailLink;
        imgContainer.appendChild(img);
        return imgContainer;
    }
};
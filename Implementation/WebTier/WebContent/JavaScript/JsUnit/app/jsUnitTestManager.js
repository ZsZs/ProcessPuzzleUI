if (!Array.prototype.push) {
    Array.prototype.push = function (anObject) {
        this[this.length] = anObject;
    };
}

if (!Array.prototype.pop) {
    Array.prototype.pop = function () {
        if (this.length > 0) {
            delete this[this.length - 1];
            this.length--;
        }
    };
}

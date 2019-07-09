export function Iterator(listToIterate) {
    this.list = listToIterate;
    this.index = -1;
    this.current = () => {
        return this.list[this.index]
    };
    this.next = () =>  {
        this.index = this.index == this.list.length - 1 ? 0 : this.index + 1;
        return this.list[this.index]
    };
    this.prev = () => {
        this.index = this.index == 0 ? this.list.length - 1 : this.index - 1;
        return this.list[this.index]
    };
}
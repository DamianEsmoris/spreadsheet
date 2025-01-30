import { err, warn } from "/scripts/modules/common.js";

export class SpreadSheetTable {
    structure;
    structure_len;
    dest;
    table;
    thead;
    tbody;
    data = [];
    typeSystem;
    pageIndex = 0;
    observer

    constructor(dest, typeSystem, structure) {
        this.typeSystem = typeSystem;
        this.structure = structure;
        this.structure_len = this.structure.length;
        this.dest = dest;
    }

    drender() {
        if (!this.table) return;
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.pageIndex = 0;
        this.table.remove();
        this.table = this.thead = this.tbody = null;
    }

    render(options = {
        infScroll: false,
        stripped: true
    }){
        if (this.table) {
            err('table can be rendered only once, if you want to rerender it, yo have to call `t.drender()` and after `t.render()`');
            return;
        }
        this.options = options;
        this.#createTable();
        this.loadPage();
        this.#handleOptionsLogic();
    }

    #handleOptionsLogic() {
        const op = this.options;
        if (op.infScroll)
            this.#enableInfiniteScroll();
    }

    #enableInfiniteScroll() {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        };
        this.observer = new IntersectionObserver(entries => {
            if (entries.length == 0 ||
                !entries.at(-1).isIntersecting ||
                this.pageIndex == this.data.length 
            )
                return
            this.loadPage();
            this.observer.disconnect();
            this.observer.observe(this.tbody.lastChild);
        }, options)
        this.observer.observe(this.tbody.lastChild);
    }


    #createTable() {
        this.table = document.createElement('table');
        if (this.options.stripped)
            table.classList.add('stripped');

        this.#createHeader()
        this.table.appendChild(this.thead);
        this.#createBody()
        this.table.appendChild(this.tbody);
        this.dest.appendChild(this.table);
    }

    #createHeader() {
        this.thead = document.createElement('thead');
        const tr = document.createElement('tr');
        this.structure.map(this.#createHeading)
            .forEach(th => tr.appendChild(th));
        this.thead.appendChild(tr);
    }

    #createHeading({title}) {
        const heading = document.createElement('th');
        heading.textContent = title;
        return heading;
    }

    #createBody() {
        this.tbody = document.createElement('tbody')
    }

    #createRow(data) {
        const tr = document.createElement('tr');
        for (let i = 0; i < data.length; i++)
            tr.appendChild(this.#createCell(data[i], this.structure[i]))
        for (let i = data.length; i < this.structure_len; i++)
            tr.appendChild(this.#createCell('', null));
        this.tbody.appendChild(tr);
    }

    #createCell(value, structureItem) {
        const td = document.createElement('td');
        if (value.length == 0) return td;
        td.textContent = value;
        if(!this.typeSystem.type(structureItem.type).isValid(value))
            td.classList.add('error');
        return td;
    }

    append(data) {
        if (this.structure_len < data.length) {
            warn(`Some data is omitted because the table structure is shorter than the input\n${data}`);
            data = data.slice(0,this.structure_len)
        }
        this.data.push(data);
    }

    loadPage(pageSize = 10) {
        if (this.data.length <= this.pageIndex ||
            this.data.length == 0)
            return;
        const dataSlice = this.data.slice(this.pageIndex, this.pageIndex+pageSize);
        for (const row of dataSlice) 
            this.#createRow(row);
        this.pageIndex += pageSize;
    }
    
}

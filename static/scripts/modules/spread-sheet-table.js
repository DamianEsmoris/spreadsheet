import { warn } from "/scripts/modules/common.js";

export class SpreadSheetTable {
    structure;
    structure_len;
    dest;
    table;
    thead;
    tbody;
    data;
    typeSystem;

    constructor(dest, typeSystem, structure) {
        this.typeSystem = typeSystem;
        this.structure = structure;
        this.structure_len = this.structure.length;
        this.dest = dest;
        this.#createTable(dest);
    }


    #createTable() {
        this.table = document.createElement('table');
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
        this.#createRow(data);
    }
}

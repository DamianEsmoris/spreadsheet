import { Type, TYPE_SYSTEM } from "/scripts/modules/types.js";
import { info, err } from "/scripts/modules/common.js";
import { SpreadSheetTable } from "/scripts/modules/spread-sheet-table.js";

(function testDefaultTypeSystem() {
    const TESTS = {
        'queryType': (() => TYPE_SYSTEM.type('text') instanceof Type),
        'textValidInput': (() => TYPE_SYSTEM.type('text').isValid('test')),
        'textInvalidInput': (() => !TYPE_SYSTEM.type('number').isValid('notanumber')),
        'extendTypeSystem' : (() => {
            // algrithm from: github.com/picandocodigo/ci_js
            const verificationFunction = (id) => {
                const digit = id.at(-1);
                let a = 0;
                for(let i = 0; i < 7; i++){
                    a += (parseInt("2987634"[i]) * parseInt(id[i])) % 10;
                }
                return (a%10 === 0 ? 0 : 10 - a%10) == digit;
            }
            TYPE_SYSTEM.addType(new Type('uyid', /^[0-9]{8}$/, verificationFunction));
            return TYPE_SYSTEM.type('uyid').isValid('89811802') &&
                !TYPE_SYSTEM.type('uyid').isValid('12345678')
        })
    };
    let allSucceed;
    info(`[Testing: default type system]`);
    for (const [testName, succeed] of Object.entries(TESTS))
        ((allSucceed = succeed()) == false) 
            ? err(`err ${testName}`)
            : info(`  ok  ${testName}`)
    if (allSucceed)
        info(`  [all green!]`);
})();

function predefinedTableTest(){
    const mStructure = (() => {
        const ISO8061Regex = /^[0-9]{4}-((0[1-9])|(1[12]))-(([0-2][1-9])|([3][01]))$/;
        TYPE_SYSTEM.addType(new Type('floatRating1-10', /^(([1-9](\.[1-9])?)|10)$/));
        TYPE_SYSTEM.addAlias('mediaRating', 'floatRating1-10');

        const [ tText, tDate, tRating ] = [ 
            TYPE_SYSTEM.type('text'),
            TYPE_SYSTEM.addType(new Type('date-iso8061', ISO8061Regex)),
            TYPE_SYSTEM.type('mediaRating'),
        ].map(t => t.name);

        TYPE_SYSTEM.removeAlias('mediaRating');
        return [
            { title: 'Title', type: tText },
            { title: 'Release date', type: tDate },
            { title: 'Director', type: tText },
            { title: 'Rating', type: tRating },
        ];
    })();

    const mTable = new SpreadSheetTable(document.body, TYPE_SYSTEM, mStructure);
    mTable.append(['Child\'s play', '1998-11-09', 'Tom Holland' ,'6.7']);
    mTable.append(['Crepúsculo (non english text)', '2008/11/20', 'Catherine Hardwicke' ,'5.3']);
    mTable.render();

}

function infiniteScrollTest() {
    const nStructure = (() => {
        const [ tUnsignedInt, positiveNumber ] = [ 
            TYPE_SYSTEM.addType(new Type('unsignedInt', /^(([1-9]([0-9]+)?)|0)$/)),
            TYPE_SYSTEM.addType(new Type('positiveNumber', null, (n) => n > 0))
        ].map(t => t.name);

        return [
            { title: 'uint', type: tUnsignedInt },
            { title: '+int', type: positiveNumber },
        ];
    })();

    const nTable = new SpreadSheetTable(document.body, TYPE_SYSTEM, nStructure);
    for (let i = -1; i <= 53; i++)
        nTable.append([i, i]);
    const opts = { striped: false, infScroll: true };
    nTable.render(opts);

    document.onkeydown = (event) => {
        if (event.key === 'r') {
            nTable.drender();
            nTable.render(opts);
        }
    }
}

infiniteScrollTest();

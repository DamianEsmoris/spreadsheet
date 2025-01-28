import { Type, TYPE_SYSTEM } from "/scripts/modules/types.js";
import { info, err } from "/scripts/modules/common.js";

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



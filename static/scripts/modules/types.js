class TypeSystem {
    #types; 
    constructor() {
        this.#types = new Map();
    }

    addType(type) {
        if (this.#types.has(type.name))
            throw new Error(`Type '${typeName}' is already declared!`);
        if (!type instanceof Type)
            throw new Error('The new type must be an instanceof the \'Type\' class');
        this.#types.set(type.name, type);
    }

    type(name) {
        return this.#types.get(name);
    }
}

export class Type {
    name;
    regex;
    matchingFunction;
    constructor(name, regex = null, matchingFunction = null) {
        this.name = name;
        this.regex = regex;
        this.matchingFunction = matchingFunction;
    }

    isValid(value) {
        if (this.regex != null && !this.regex.test(value))
            return false;
        if (this.matchingFunction != null && !this.matchingFunction(value))
            return false;
        return true;
    }
}

export const TYPE_SYSTEM = (() => {
    const typeSystem = new TypeSystem();
    typeSystem.addType(new Type('text', /^\w{1,255}$/));
    typeSystem.addType(new Type('number', /-?\d+$/));
    return typeSystem;
})();

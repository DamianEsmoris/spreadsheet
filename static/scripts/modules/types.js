class TypeSystem {
    #types; 
    #aliases; 
    constructor() {
        this.#types = new Map();
        this.#aliases = new Map();
    }

    addType(type) {
        if (this.#types.has(type.name))
            throw new Error(`Type '${typeName}' is already declared!`);
        if (!type instanceof Type)
            throw new Error('The new type must be an instanceof the \'Type\' class');
        this.#types.set(type.name, type);
        return type;
    }

    addAlias(alias, type) {
        this.#aliases.set(alias, type);
    }

    removeAlias(alias) {
        this.#aliases.delete(alias);
    }

    type(name) {
        const alias = this.#aliases.get(name);
        return this.#types.get(alias || name);
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
    typeSystem.addType(new Type('any', /^.+$/i));
    typeSystem.addType(new Type('text', /^[\s\d\w.'-]{0,255}$/));
    typeSystem.addType(new Type('spanishText', /^[áéíóúü\s\d\w.'-]{0,255}$/));
    typeSystem.addType(new Type('extenedeText', /^[áéíóúü\s\d\w'"_+=*^,.:;]{0,255}$/));
    typeSystem.addType(new Type('number', /-?\d+$/));
    return typeSystem;
})();

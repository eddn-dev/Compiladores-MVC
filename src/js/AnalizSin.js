// Hacer el descenso recursivo para la calculadora

// Hacer el descenso recursivo para ER a AFN
// Definición de tokens
const TOKEN = {
    OR: 10,
    CONCAT: 20,
    CERRPOS: 30,
    CERRKLEEN: 40,
    CERROPC: 50,
    LPAREN: 60,
    SPACE: 70,
    RPAREN: 80,
    LCORCH: 90,
    RCORCH: 100,
    DASH: 110,
    SIMB: 120,
    END: 0,
};

// Definición de nodo para el árbol sintáctico
class Nodo {
    constructor(name, children = []) {
        this.name = name;
        this.children = children;
    }
}

// Clase ExpresionRegular
class ExpresionRegular {
    constructor(sigma = "", matrizTransicionAFD = null) {
        this.AL = new AnalizadorLexico(sigma, matrizTransicionAFD);
        this.result = null; // AFN resultante
        this.ER = sigma;
        this.tree = new Nodo("E"); // Nodo raíz del árbol sintáctico
    }

    getTree() {
        return this.tree;
    }

    getResult() {
        return this.result;
    }

    getER() {
        return this.ER;
    }

    setER(sigma) {
        this.ER = sigma;
        this.AL.setSigma(sigma);
    }

    parse() {
        const f = new AFN();
        const child = [];

        if (this.E(f, child)) {
            this.tree.children = child;
            const token = this.AL.yylex();
            if (token === TOKEN.END) {
                this.result = f;
                return true;
            } else {
                // Si hay tokens adicionales, error
                return false;
            }
        }
        return false;
    }

    E(f, father) {
        const childT = [];
        if (this.T(f, childT)) {
            father.push(new Nodo("T", childT));
            const childEp = [];
            if (this.Ep(f, childEp)) {
                father.push(new Nodo("E'", childEp));
                return true;
            }
        }
        return false;
    }

    Ep(f, father) {
        const token = this.AL.yylex();
        if (token === TOKEN.OR) {
            father.push(new Nodo("|"));
            const f1 = new AFN();
            const childT = [];
            if (this.T(f1, childT)) {
                father.push(new Nodo("T", childT));
                const childEp = [];
                if (this.Ep(f1, childEp)) {
                    father.push(new Nodo("E'", childEp));
                    f.Unir(f1); // Unir los AFNs
                    return true;
                }
            }
            return false;
        }
        this.AL.undoToken();
        return true;
    }

    T(f, father) {
        const childC = [];
        if (this.C(f, childC)) {
            father.push(new Nodo("C", childC));
            const childTp = [];
            if (this.Tp(f, childTp)) {
                father.push(new Nodo("T'", childTp));
                return true;
            }
        }
        return false;
    }

    Tp(f, father) {
        const token = this.AL.yylex();
        if (token === TOKEN.CONCAT) {
            father.push(new Nodo("&"));
            const f1 = new AFN();
            const childC = [];
            if (this.C(f1, childC)) {
                father.push(new Nodo("C", childC));
                const childTp = [];
                if (this.Tp(f1, childTp)) {
                    father.push(new Nodo("T'", childTp));
                    f.Concatenar(f1); // Concatenar los AFNs
                    return true;
                }
            }
            return false;
        }
        this.AL.undoToken();
        return true;
    }

    C(f, father) {
        const childF = [];
        if (this.F(f, childF)) {
            father.push(new Nodo("F", childF));
            const childCp = [];
            if (this.Cp(f, childCp)) {
                father.push(new Nodo("C'", childCp));
                return true;
            }
        }
        return false;
    }

    Cp(f, father) {
        const token = this.AL.yylex();
        switch (token) {
            case TOKEN.CERRPOS:
                father.push(new Nodo("+"));
                if (this.Cp(f, [])) {
                    f.Cerradura_Positiva(); // Aplicar cerradura positiva
                    return true;
                }
                return false;
            case TOKEN.CERRKLEEN:
                father.push(new Nodo("*"));
                if (this.Cp(f, [])) {
                    f.Cerradura_Kleene(); // Aplicar cerradura de Kleene
                    return true;
                }
                return false;
            case TOKEN.CERROPC:
                father.push(new Nodo("?"));
                if (this.Cp(f, [])) {
                    f.Opcional(); // Aplicar operador opcional
                    return true;
                }
                return false;
            default:
                this.AL.undoToken();
                return true;
        }
    }

    F(f, father) {
        const token = this.AL.yylex();
        switch (token) {
            case TOKEN.LPAREN:
                father.push(new Nodo("("));
                const childE = [];
                if (this.E(f, childE)) {
                    father.push(new Nodo("E", childE));
                    const token1 = this.AL.yylex();
                    if (token1 === TOKEN.RPAREN) {
                        father.push(new Nodo(")"));
                        return true;
                    }
                }
                return false;
            case TOKEN.LCORCH:
                father.push(new Nodo("["));
                const token1_corch = this.AL.yylex();
                if (token1_corch === TOKEN.SIMB) {
                    const lexema = this.AL.getLexema();
                    const simb = lexema[0] === '\\' ? lexema[1] : lexema[0];
                    father.push(new Nodo(simb));
                    const token2 = this.AL.yylex();
                    if (token2 === TOKEN.DASH) {
                        father.push(new Nodo("-"));
                        const token3 = this.AL.yylex();
                        if (token3 === TOKEN.SIMB) {
                            const lexema2 = this.AL.getLexema();
                            const simb2 = lexema2[0] === '\\' ? lexema2[1] : lexema2[0];
                            father.push(new Nodo(simb2));
                            const token4 = this.AL.yylex();
                            if (token4 === TOKEN.RCORCH) {
                                father.push(new Nodo("]"));
                                f = AFN.Crear_Basico_AFN(simb, simb2);
                                return true;
                            }
                        }
                    }
                }
                return false;
            case TOKEN.SIMB:
                const lexemaSimbolo = this.AL.getLexema();
                const simbolo = lexemaSimbolo[0] === '\\' ? lexemaSimbolo[1] : lexemaSimbolo[0];
                father.push(new Nodo(simbolo));
                f = AFN.Crear_Basico_AFN(simbolo);
                return true;
            default:
                return false;
        }
    }
}

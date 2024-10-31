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

// Clase ExpresionRegular
class ExpresionRegular {
    constructor(sigma = "", matrizTransicionAFD = null) {
        this.ER = sigma;
        this.AL = new AnalizadorLexico(sigma, matrizTransicionAFD);
        this.result = null; // AFN resultante
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
                if (token1_corch === TOKEN.SIMB || token1_corch === TOKEN.SPACE) {
                    const lexema = this.AL.getLexema();
                    const simb = lexema[0] === '\\' ? lexema[1] : lexema[0];
                    father.push(new Nodo(simb));
                    const token2 = this.AL.yylex();
                    if (token2 === TOKEN.DASH) {
                        father.push(new Nodo("-"));
                        const token3 = this.AL.yylex();
                        if (token3 === TOKEN.SIMB || token3 === TOKEN.SPACE) {
                            const lexema2 = this.AL.getLexema();
                            const simb2 = lexema2[0] === '\\' ? lexema2[1] : lexema2[0];
                            father.push(new Nodo(simb2));
                            const token4 = this.AL.yylex();
                            if (token4 === TOKEN.RCORCH) {
                                father.push(new Nodo("]"));
                                const afnBasico = AFN.Crear_Basico_AFN(simb, simb2);
                                // Asignar el afnBasico al parámetro f
                                Object.assign(f, afnBasico);
                                return true;
                            }
                        }
                    }
                }
                return false;
            case TOKEN.SIMB:
            case TOKEN.SPACE:
                const lexemaSimbolo = this.AL.getLexema();
                const simbolo = lexemaSimbolo[0] === '\\' ? lexemaSimbolo[1] : lexemaSimbolo[0];
                father.push(new Nodo(simbolo));
                const afnBasico = AFN.Crear_Basico_AFN(simbolo);
                // Asignar el afnBasico al parámetro f
                Object.assign(f, afnBasico);
                return true;
            default:
                return false;
        }
    }
}


// Definición de tokens
const TOKENCALC = {
    PLUS: 10,
    MINUS: 20,
    PROD: 30,
    DIV: 40,
    LPAREN: 50,
    RPAREN: 60,
    SPACE: 70,
    NUM: 80,
    END: 0,
};

// Clase Nodo para el árbol sintáctico
function Nodo(name, children) {
    this.name = name;
    this.children = children || [];
}

// Clase Calculadora
class Calculadora {
    constructor(sigma = '', matrizTransicionAFD = null) {
        this.AL = new AnalizadorLexico(sigma, matrizTransicionAFD);
        this.resultado = 0;
        this.tree = null;
    }

    setSigma(sigma) {
        this.AL.setSigma(sigma);
    }

    parse() {
        const resultado = { val: 0 };
        const eResult = this.E(resultado);
        if (eResult.val && this.AL.yylex() === TOKENCALC.END) {
            this.resultado = resultado.val;
            this.tree = eResult.tree;
            return true;
        }
        return false;
    }

    E(resultado) {
        const temp = { val: 0 };
        const tree = new Nodo("E", []);
        const tResult = this.T(temp);
        if (tResult.val) {
            resultado.val = temp.val;
            tree.children.push(tResult.tree);
            const epResult = this.Ep(resultado);
            if (epResult.val) {
                tree.children.push(epResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }

    Ep(resultado) {
        const token = this.AL.yylex();
        const tree = new Nodo("E'", []);
        const temp = { val: 0 };

        if (token === TOKENCALC.PLUS || token === TOKENCALC.MINUS) {
            const tResult = this.T(temp);
            if (tResult.val) {
                resultado.val += (token === TOKENCALC.PLUS ? temp.val : -temp.val);
                tree.children.push(tResult.tree, new Nodo(token === TOKENCALC.PLUS ? "+" : "-"));
                const epResult = this.Ep(resultado);
                if (epResult.val) {
                    tree.children.push(epResult.tree);
                }
                return { val: true, tree: tree };
            }
            return { val: false, tree: tree };
        }
        this.AL.undoToken();
        tree.children.push(new Nodo("ε"));
        return { val: true, tree: tree };
    }

    T(resultado) {
        const temp = { val: 0 };
        const tree = new Nodo("T", []);
        const fResult = this.F(temp);
        if (fResult.val) {
            resultado.val = temp.val;
            tree.children.push(fResult.tree);
            const tpResult = this.Tp(resultado);
            if (tpResult.val) {
                tree.children.push(tpResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }

    Tp(resultado) {
        const token = this.AL.yylex();
        const tree = new Nodo("T'", []);
        const temp = { val: 0 };

        if (token === TOKENCALC.PROD || token === TOKENCALC.DIV) {
            const fResult = this.F(temp);
            if (fResult.val) {
                resultado.val = token === TOKENCALC.PROD ? resultado.val * temp.val : resultado.val / temp.val;
                tree.children.push(fResult.tree, new Nodo(token === TOKENCALC.PROD ? "*" : "/"));
                const tpResult = this.Tp(resultado);
                if (tpResult.val) {
                    tree.children.push(tpResult.tree);
                }
                return { val: true, tree: tree };
            }
            return { val: false, tree: tree };
        }
        this.AL.undoToken();
        tree.children.push(new Nodo("ε"));
        return { val: true, tree: tree };
    }

    F(resultado) {
        const token = this.AL.yylex();
        const tree = new Nodo("F", []);

        if (token === TOKENCALC.LPAREN) {
            const eResult = this.E(resultado);
            if (eResult.val && this.AL.yylex() === TOKENCALC.RPAREN) {
                tree.children.push(new Nodo("("), eResult.tree, new Nodo(")"));
                return { val: true, tree: tree };
            }
            return { val: false, tree: tree };
        } else if (token === TOKENCALC.NUM) {
            resultado.val = parseFloat(this.AL.getLexema());
            tree.children.push(new Nodo("num", [new Nodo(`${resultado.val}`)]));
            return { val: true, tree: tree };
        }
        this.AL.undoToken();
        return { val: false, tree: tree };
    }

    recorrerPostorden(nodo) {
        let resultado = "";

        if (nodo.children) {
            for (const child of nodo.children) {
                resultado += this.recorrerPostorden(child) + " ";
            }
        }

        if (nodo.name !== "E" && nodo.name !== "E'" && nodo.name !== "T" && nodo.name !== "T'" && nodo.name !== "F" && nodo.name !== "ε" && nodo.name !== "num" && nodo.name !== "(" && nodo.name !== ")") {
            resultado += nodo.name + " ";
        }

        return resultado.trim();
    }

    getPostfijo() {
        if (this.tree) {
            return this.recorrerPostorden(this.tree).trim();
        }
        return "";
    }

    getResultado() {
        return this.resultado;
    }
}

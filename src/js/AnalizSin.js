const TOKEN = {
    SUMA: 10,
    RESTA: 20,
    MULTI: 30,
    DIV: 40,
    PARENL: 50,
    PARENR: 60,
    ESPACIO: 70,
    NUM: 80,
    FIN: 0,
};

 function cargarAutomata() {
    const rutaArchivoAFD = '/Compiladores MVC/afdCalculadora.txt';
    return  cargarAutomataDesdeArchivo(rutaArchivoAFD);
}

function gramaticaAutomata()  {
    const matriz =  cargarAutomata();
    const AL = new AnalizadorLexico("", matriz);

    const data = [];

    function E(resultado) {
        const temp = { val: 0 };
        const tree = { name: "E", children: [] };

        const tResult = T(temp);
        if (tResult.val) {
            resultado.val = temp.val;
            tree.children.push(tResult.tree);
            const epResult = Ep(resultado);
            if (epResult.val) {
                tree.children.push(epResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }

    function Ep(resultado) {
        const token = AL.yylex();
        const tree = { name: "E'", children: [] };
        const temp = { val: 0 };

        if (token === TOKEN.SUMA || token === TOKEN.RESTA) {
            const tResult = T(temp);
            if (tResult.val) {
                resultado.val += (token === TOKEN.SUMA ? temp.val : -temp.val);
                tree.children.push(tResult.tree, { name: token === TOKEN.SUMA ? "+" : "-" });
                const epResult = Ep(resultado);
                if (epResult.val) {
                    tree.children.push(epResult.tree);
                }
                return { val: true, tree: tree };
            }
            return { val: false, tree: tree };
        }
        AL.undoToken();
        tree.children.push({ name: "ε" });
        return { val: true, tree: tree };
    }

    function T(resultado) {
        const temp = { val: 0 };
        const tree = { name: "T", children: [] };

        const fResult = F(temp);
        if (fResult.val) {
            resultado.val = temp.val;
            tree.children.push(fResult.tree);
            const tpResult = Tp(resultado);
            if (tpResult.val) {
                tree.children.push(tpResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }

    function Tp(resultado) {
        const token = AL.yylex();
        const tree = { name: "T'", children: [] };
        const temp = { val: 0 };

        if (token === TOKEN.MULTI || token === TOKEN.DIV) {
            const fResult = F(temp);
            if (fResult.val) {
                resultado.val = token === TOKEN.MULTI ? resultado.val * temp.val : resultado.val / temp.val;
                tree.children.push(fResult.tree, { name: token === TOKEN.MULTI ? "*" : "/" });
                const tpResult = Tp(resultado);
                if (tpResult.val) {
                    tree.children.push(tpResult.tree);
                }
                return { val: true, tree: tree };
            }
            return { val: false, tree: tree };
        }
        AL.undoToken();
        tree.children.push({ name: "ε" });
        return { val: true, tree: tree };
    }

    function F(resultado) {
        const token = AL.yylex();
        const tree = { name: "F", children: [] };

        if (token === TOKEN.PARENL) {
            const eResult = E(resultado);
            if (eResult.val && AL.yylex() === TOKEN.PARENR) {
                tree.children.push({ name: "(" }, eResult.tree, { name: ")" });
                return { val: true, tree: tree };
            }
            return { val: false, tree: tree };
        } else if (token === TOKEN.NUM) {
            resultado.val = parseFloat(AL.getLexema());
            tree.children.push({ name: "num", children: [{ name: `${resultado.val}` }] });
            return { val: true, tree: tree };
        }
        AL.undoToken();
        return { val: false, tree: tree };
    }

    function recorrerPostorden(nodo) {
        let resultado = "";

        if (nodo.children) {
            for (const child of nodo.children) {
                resultado += recorrerPostorden(child) + " ";
            }
        }

        if (!["E", "E'", "T", "T'", "F", "ε", "num", "(", ")"].includes(nodo.name)) {
            resultado += nodo.name + " ";
        }

        return resultado.trim();
    }

    function limpiarArchivo(nombreArchivo) {
        fs.writeFileSync(nombreArchivo, '', 'utf-8');
    }

    function parseConPostfijo(input) {
        AL.setSigma(input);
        const resultado = { val: 0 };
        const eResult = E(resultado);

        if (eResult.val && AL.yylex() === TOKEN.FIN) {
            const postfijo = recorrerPostorden(eResult.tree).trim();
            return { valid: true, postfijo: postfijo, resultado: resultado.val };
        }
        return { valid: false, postfijo: "", resultado: 0 };
    }

    function runTestsConPostfijo() {
        const testCases = [
            "((1+2)*3)",
            "2+1",
        ];

        for (const test of testCases) {
            console.log(`Cadena: "${test}"`);
            const resultado = parseConPostfijo(test);
            if (resultado.valid) {
                console.log(`Cadena: Válida`);
                console.log(`Resultado: ${resultado.resultado}`);
                console.log(`Posfijo: ${resultado.postfijo}\n`);  // Muestra el resultado en notación postfija
            } else {
                console.log("Cadena: Inválida\n");
            }
        }
    }

    limpiarArchivo('/Compiladores MVC/afdCalculadora.txt');
    runTestsConPostfijo();

     function handleCalculadora(modal) {
        const fields = modal.getFields();
        const automatonId = fields['automatonId'].trim();
        const regexInput = fields['regexInput'].trim();

        try {
            const matrizTransicionAFD =  cargarAutomataDesdeArchivo('/Compiladores MVC/ER_AFN.txt');
            AL.matrizTransicionAFD = matrizTransicionAFD;

            const resultado = parseConPostfijo(regexInput);

            if (resultado.valid) {
                console.log(`Expresión válida. Resultado: ${resultado.resultado}`);
            } else {
                console.log("Expresión inválida.");
            }
        } catch (error) {
            console.error("Error en el análisis:", error);
        }
    }
};
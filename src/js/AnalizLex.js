class AnalizadorLexico {
    constructor(sigma = "", matrizTransicionAFD = null) {
        this.token = -1;
        this.EdoActual = 0;
        this.EdoTransicion = 0;
        this.CadenaSigma = sigma;
        this.Lexema = "";
        this.PasoPorEdoAcept = false;
        this.IniLexema = 0;
        this.FinLexema = -1;
        this.IndiceCaracterActual = 0;
        this.CaracterActual = '';
        this.Pila = [];
        this.matrizTransicionAFD = matrizTransicionAFD;
    }

    getEstadoAnalizadorLexico() {
        return {
            CaracterActual: this.CaracterActual,
            EdoActual: this.EdoActual,
            EdoTransicion: this.EdoTransicion,
            FinLexema: this.FinLexema,
            IndiceCaracterActual: this.IndiceCaracterActual,
            IniLexema: this.IniLexema,
            Lexema: this.Lexema,
            PasoPorEdoAcept: this.PasoPorEdoAcept,
            token: this.token,
            Pila: [...this.Pila]
        };
    }

    setEstadoAnalizadorLexico(estado) {
        this.CaracterActual = estado.CaracterActual;
        this.EdoActual = estado.EdoActual;
        this.EdoTransicion = estado.EdoTransicion;
        this.FinLexema = estado.FinLexema;
        this.IndiceCaracterActual = estado.IndiceCaracterActual;
        this.IniLexema = estado.IniLexema;
        this.Lexema = estado.Lexema;
        this.PasoPorEdoAcept = estado.PasoPorEdoAcept;
        this.token = estado.token;
        this.Pila = [...estado.Pila];
        return true;
    }

    setSigma(sigma) {
        this.CadenaSigma = sigma;
        this.PasoPorEdoAcept = false;
        this.IniLexema = 0;
        this.FinLexema = -1;
        this.IndiceCaracterActual = 0;
        this.token = -1;
        this.Pila = [];
    }

    getLexema() {
        return this.Lexema;
    }

    getIndiceCaracterActual() {
        return this.IndiceCaracterActual;
    }

    cadenaXAnalizar() {
        return this.CadenaSigma.substring(this.IndiceCaracterActual);
    }

    getEstadoActual() {
        return this.EdoActual;
    }

    getTamSigma() {
        return this.CadenaSigma.length;
    }

    getIniLexema() {
        return this.IniLexema;
    }

    getLongLexema() {
        return this.Lexema.length;
    }

    yylex() {
        while (true) {
            this.Pila.push(this.IndiceCaracterActual);
            if (this.IndiceCaracterActual >= this.CadenaSigma.length) {
                this.Lexema = "";
                return SimbolosEspeciales.FIN;
            }
            this.IniLexema = this.IndiceCaracterActual;
            this.EdoActual = 0;
            this.PasoPorEdoAcept = false;
            this.FinLexema = -1;
            this.token = -1;
    
            while (this.IndiceCaracterActual < this.CadenaSigma.length) {
                this.CaracterActual = this.CadenaSigma[this.IndiceCaracterActual];
                const charCode = this.CadenaSigma.charCodeAt(this.IndiceCaracterActual);
    
                const columnaTransicion = charCode + 1; // Ajuste del índice de columna
    
                // Verificar si existe una transición desde el estado actual con el carácter actual
                if (this.matrizTransicionAFD[this.EdoActual][columnaTransicion] !== -1 && this.matrizTransicionAFD[this.EdoActual][columnaTransicion] !== undefined) {
                    this.EdoTransicion = this.matrizTransicionAFD[this.EdoActual][columnaTransicion];
    
                    // Verificar si el estado de transición es estado de aceptación
                    const indiceToken = 257; // Índice del token (columna 257)
                    if (this.matrizTransicionAFD[this.EdoTransicion][indiceToken] !== -1 && this.matrizTransicionAFD[this.EdoTransicion][indiceToken] !== undefined) {
                        this.PasoPorEdoAcept = true;
                        this.token = this.matrizTransicionAFD[this.EdoTransicion][indiceToken];
                        this.FinLexema = this.IndiceCaracterActual;
                    }
    
                    this.IndiceCaracterActual++;
                    this.EdoActual = this.EdoTransicion;
                } else {
                    break;
                }
            }
    
            if (!this.PasoPorEdoAcept) {
                // No se encontró un estado de aceptación, error léxico
                this.IndiceCaracterActual = this.IniLexema + 1;
                this.Lexema = this.CadenaSigma.substring(this.IniLexema, this.IndiceCaracterActual);
                this.token = SimbolosEspeciales.ERROR;
                return this.token;
            }
    
            // Construir el lexema reconocido
            this.Lexema = this.CadenaSigma.substring(this.IniLexema, this.FinLexema + 1);
            this.IndiceCaracterActual = this.FinLexema + 1;
    
            if (this.token === SimbolosEspeciales.OMITIR) {
                // Si el token es de tipo OMITIR, reiniciar y continuar
                continue;
            } else {
                return this.token;
            }
        }
    }
    

    undoToken() {
        if (this.Pila.length === 0) return false;
        this.IndiceCaracterActual = this.Pila.pop();
        return true;
    }
}

// Definición de símbolos especiales
const SimbolosEspeciales = {
    FIN: -1,
    ERROR: -2,
    OMITIR: 20
};

class Estado {
    constructor() {
        this.Id_Edo = Estado.Cant_Edos;
        Estado.Cant_Edos += 1;
        this.Transiciones = new Set();
        this.Edo_Acept = false;
        this.Token = -1;
    }
}

class Transicion {
    constructor(simb_inf, simb_sup, destino) {
        this.Simbolo_Inferior = simb_inf;
        this.Simbolo_Superior = simb_sup;
        this.Edo_Destino = destino;
    }
}

Estado.Cant_Edos = 0;
const Epsilon = 'ε'; 
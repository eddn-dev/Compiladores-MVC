class ConjuntoDeEstados {
    constructor(estados, id) {
        this.Estados = estados;
        this.Id = id;
        this.Token = this.obtenerTokenAsociado();
    }

    obtenerTokenAsociado() {
        let tokens = Array.from(this.Estados)
            .filter(e => e.Edo_Acept && e.Token !== -1)
            .map(e => e.Token);

        if (tokens.length > 0) {
            // Asignar el token de menor valor (mayor prioridad)
            return Math.min(...tokens);
        } else {
            return -1;
        }
    }

    esEstadoAceptacion() {
        return this.Token !== -1;
    }
}
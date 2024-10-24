const Epsilon = 'ε'; // Define Epsilon como una constante global

class Estado {
    constructor() {
        this.Id_Edo = Estado.Cant_Edos;
        Estado.Cant_Edos += 1;
        this.Transiciones = new Set(); // Suponemos una implementación de Set
        this.Edo_Acept = false;
        this.Token = -1;
    }
}
Estado.Cant_Edos = 0;

class Transicion {
    constructor(simb_inf, simb_sup, destino) {
        this.Simbolo_Inferior = simb_inf;
        this.Simbolo_Superior = simb_sup;
        this.Edo_Destino = destino;
    }
}

class AFN {
    constructor() {
        this.Edo_Inicial = null;
        this.Estados = new Set();
        this.Alfabeto = new Set();
        this.Edos_Acept = new Set();
        this.ID_AFN = AFN.Cant_AFN;
        AFN.Cant_AFN += 1;
    }

    static Cant_AFN = 0; // Inicializa el contador estático

    static Crear_Basico_AFN(s1, s2 = null) {
        let nuevo_AFN = new AFN();
        let e1 = new Estado();
        let e2 = new Estado();

        if (s2 === null) {
            let t = new Transicion(s1, s1, e2);
            e1.Transiciones.add(t);
            nuevo_AFN.Alfabeto.add(s1);
        } else {
            // Caso de un rango de símbolos
            if (s2 < s1) {
                [s1, s2] = [s2, s1]; // Intercambiar s1 y s2 si están en orden incorrecto
            }
            let t = new Transicion(s1, s2, e2);
            e1.Transiciones.add(t);
            for (let i = s1.charCodeAt(0); i <= s2.charCodeAt(0); i++) {
                nuevo_AFN.Alfabeto.add(String.fromCharCode(i));
            }
        }

        e2.Edo_Acept = true;
        nuevo_AFN.Edo_Inicial = e1;
        nuevo_AFN.Edos_Acept.add(e2);
        nuevo_AFN.Estados.add(e1);
        nuevo_AFN.Estados.add(e2);

        return nuevo_AFN;
    }

    Unir(f2) {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.Transiciones.add(new Transicion(Epsilon, Epsilon, this.Edo_Inicial));
        e1.Transiciones.add(new Transicion(Epsilon, Epsilon, f2.Edo_Inicial));

        for (let e of this.Edos_Acept) {
            e.Transiciones.add(new Transicion(Epsilon, Epsilon, e2));
            e.Edo_Acept = false;
        }

        for (let e of f2.Edos_Acept) {
            e.Transiciones.add(new Transicion(Epsilon, Epsilon, e2));
            e.Edo_Acept = false;
        }

        e2.Edo_Acept = true;

        this.Edo_Inicial = e1;
        this.Edos_Acept.clear();
        this.Edos_Acept.add(e2);
        this.Estados = new Set([...this.Estados, ...f2.Estados]);
        this.Estados.add(e1);
        this.Estados.add(e2);
        this.Alfabeto = new Set([...this.Alfabeto, ...f2.Alfabeto]);

        return this;
    }

    Concatenar(f2) {
        for (let e of this.Edos_Acept) {
            e.Transiciones = new Set([...e.Transiciones, ...f2.Edo_Inicial.Transiciones]); 
            e.Edo_Acept = false;
        }

        this.Estados = new Set([...this.Estados, ...f2.Estados]);
        this.Edos_Acept.clear();
        this.Edos_Acept = new Set([...f2.Edos_Acept]); 
        this.Alfabeto = new Set([...this.Alfabeto, ...f2.Alfabeto]);

        return this;
    }

    Cerradura_Positiva() {
        let e1 = new Estado();
        let e2 = new Estado();
    
        e1.Transiciones.add(new Transicion(Epsilon, Epsilon, this.Edo_Inicial));
    
        for (let e of this.Edos_Acept) {
            e.Transiciones.add(new Transicion(Epsilon, Epsilon, e2));
            e.Transiciones.add(new Transicion(Epsilon, Epsilon, this.Edo_Inicial));
            e.Edo_Acept = false;
        }
    
        e2.Edo_Acept = true;
    
        this.Edo_Inicial = e1;
        this.Edos_Acept.clear();
        this.Edos_Acept.add(e2);
        this.Estados.add(e1);
        this.Estados.add(e2);
    
        return this;
    }
    
    Cerradura_Kleene() {
        // Crea nuevos estados inicial y final
        let e1 = new Estado();
        let e2 = new Estado();
    
        // Conecta el nuevo estado inicial al original
        e1.Transiciones.add(new Transicion(Epsilon, Epsilon, this.Edo_Inicial));
    
        // Conecta los estados de aceptación originales al nuevo estado final y al estado inicial original
        for (let e of this.Edos_Acept) {
            e.Transiciones.add(new Transicion(Epsilon, Epsilon, e2));
            e.Transiciones.add(new Transicion(Epsilon, Epsilon, this.Edo_Inicial));
            e.Edo_Acept = false;
        }
    
        // Conecta el nuevo estado inicial al nuevo estado final
        e1.Transiciones.add(new Transicion(Epsilon, Epsilon, e2));
    
        // Actualiza el estado inicial y los estados de aceptación
        e2.Edo_Acept = true;
        this.Edo_Inicial = e1;
        this.Edos_Acept.clear();
        this.Edos_Acept.add(e2);
        this.Estados.add(e1);
        this.Estados.add(e2);
    
        return this;
    }

    Opcional() {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.Transiciones.add(new Transicion(Epsilon, Epsilon, this.Edo_Inicial));
        e1.Transiciones.add(new Transicion(Epsilon, Epsilon, e2));

        for (let e of this.Edos_Acept) {
            e.Transiciones.add(new Transicion(Epsilon, Epsilon, e2));
            e.Edo_Acept = false;
        }

        e2.Edo_Acept = true;

        this.Edo_Inicial = e1;
        this.Edos_Acept.clear();
        this.Edos_Acept.add(e2);
        this.Estados.add(e1);
        this.Estados.add(e2);

        return this;
    }

    static Cerradura_Epsilon(e) {
        let C = new Set();
        let P = []; // Usamos un array como pila
        P.push(e);

        while (P.length > 0) {
            let actual = P.pop();
            if (C.has(actual)) continue;
            C.add(actual);

            for (let t of actual.Transiciones) {
                if (t.Simbolo_Inferior === Epsilon && t.Simbolo_Superior === Epsilon) {
                    if (!C.has(t.Edo_Destino)) {
                        P.push(t.Edo_Destino);
                    }
                }
            }
        }

        return C;
    }

    static Cerradura(D) {
        let R = new Set();

        for (let e of D) {
            R = new Set([...R, ...AFN.Cerradura_Epsilon(e)]); 
        }

        return R;
    }

    static Mover(C, simb) {
        let R = new Set();

        for (let e of C) {
            for (let t of e.Transiciones) {
                if (t.Simbolo_Inferior <= simb && simb <= t.Simbolo_Superior) {
                    R.add(t.Edo_Destino);
                }
            }
        }

        return R;
    }

    static ir_a(C, simb) {
        let M = AFN.Mover(C, simb);
        let R = AFN.Cerradura(M);
        return R;
    }

    convertirAFD() {
        const C = new Map(); // Mapa para almacenar conjuntos de estados y sus IDs
        const Q = []; // Cola para procesar los conjuntos
        let Contador = 0;

        // Obtener la cerradura epsilon del estado inicial
        const cierreInicial = AFN.Cerradura_Epsilon(this.Edo_Inicial);
        const cierreInicialKey = [...cierreInicial].map(e => e.Id_Edo).sort().join(',');
        const S_Aux = new ConjuntoDeEstados(cierreInicial, Contador++);
        C.set(cierreInicialKey, S_Aux);
        Q.push(S_Aux);

        while (Q.length > 0) {
            const S_h = Q.shift();

            for (const c of this.Alfabeto) {
                const irAResult = AFN.ir_a(S_h.Estados, c);
                const cierre = AFN.Cerradura(irAResult);
                if (cierre.size === 0) continue;

                const cierreKey = [...cierre].map(e => e.Id_Edo).sort().join(',');

                if (!C.has(cierreKey)) {
                    const nuevoConjunto = new ConjuntoDeEstados(cierre, Contador++);
                    C.set(cierreKey, nuevoConjunto);
                    Q.push(nuevoConjunto);
                }
            }
        }

        // Crear los estados del AFD
        const d = new AFD();
        const estados_AFD_Map = new Map(); // Mapa para acceder a los estados por ID

        for (const [key, Si] of C.entries()) {
            const nuevo_estado = new Estado_AFD(Si.Id);
            nuevo_estado.esFinal = Si.esEstadoAceptacion(this.Edos_Acept);
            if (Si.contieneEstado(this.Edo_Inicial)) {
                d.Edo_Inicial = nuevo_estado;
            }
            estados_AFD_Map.set(Si.Id, nuevo_estado);
            d.Estados.add(nuevo_estado);
        }

        // Asignar transiciones
        for (const [key, Si] of C.entries()) {
            const origen = estados_AFD_Map.get(Si.Id);
            for (const c of this.Alfabeto) {
                const irAResult = AFN.ir_a(Si.Estados, c);
                const cierre = AFN.Cerradura(irAResult);
                if (cierre.size === 0) continue;

                const cierreKey = [...cierre].map(e => e.Id_Edo).sort().join(',');
                const destinoConjunto = C.get(cierreKey);
                if (destinoConjunto) {
                    const destino = estados_AFD_Map.get(destinoConjunto.Id);
                    origen.transiciones.set(c, destino);
                }
            }
        }

        d.Alfabeto = new Set(this.Alfabeto); 
        return d;
    }
}

// Clase para manejar conjuntos de estados con un identificador
class ConjuntoDeEstados {
    constructor(estados, id) {
        this.Estados = estados;
        this.Id = id;
    }

    esEstadoAceptacion(estadosAceptacion) {
        for (const e of estadosAceptacion) {
            if (this.Estados.has(e)) {
                return true;
            }
        }
        return false;
    }

    contieneEstado(estadoInicial) {
        return this.Estados.has(estadoInicial);
    }
}

// Clase para manejar los estados del AFD
class Estado_AFD {
    constructor(id = null) {
        this.id = id; // Asigna el ID durante la creación
        this.transiciones = new Map(); // Cada estado AFD tiene un mapa de transiciones
        this.esFinal = false; // Estado de aceptación
    }
}

// Clase para manejar el AFD
class AFD {
    constructor() {
        this.Edo_Inicial = null;
        this.Estados = new Set(); // Conjunto de estados del AFD
        this.Alfabeto = new Set(); // Alfabeto del AFD
    }

    static Cant_AFD = 0; // Inicializa el contador estático (si es necesario)
}

// Función auxiliar para comparar si dos conjuntos de estados son iguales
function setsIguales(setA, setB) {
    if (setA.size !== setB.size) return false;
    for (const a of setA) {
        if (!setB.has(a)) return false;
    }
    return true;
}

// Función auxiliar para buscar un estado AFD por su id en un mapa de estados AFD
function buscarEstadoAFD(estados_AFD_Map, id) {
    return estados_AFD_Map.get(id) || null;
}

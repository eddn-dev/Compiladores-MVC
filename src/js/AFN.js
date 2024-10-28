class AFN {
    constructor() {
        this.Edo_Inicial = null;
        this.Estados = new Set();
        this.Alfabeto = new Set();
        this.Edos_Acept = new Set();
        this.ID_AFN = AFN.Cant_AFN;
        AFN.Cant_AFN += 1;
        this.matrizTransicionAFD = null;
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

    static UnirAFNs(afns) {
        if (afns.length === 0) {
            throw new Error('No se proporcionaron AFNs para unir.');
        }
    
        // Crear un nuevo AFN que será el resultado de la unión
        let afnResultado = new AFN();
    
        // Crear un nuevo estado inicial
        let nuevoEstadoInicial = new Estado();
    
        // Para cada AFN en la lista
        for (let afn of afns) {
            // Agregar una transición épsilon desde el nuevo estado inicial al estado inicial del AFN actual
            let transicionEpsilon = new Transicion(Epsilon, Epsilon, afn.Edo_Inicial);
            nuevoEstadoInicial.Transiciones.add(transicionEpsilon);
    
            // Agregar los estados y el alfabeto del AFN actual al AFN resultado
            afnResultado.Estados = new Set([...afnResultado.Estados, ...afn.Estados]);
            afnResultado.Alfabeto = new Set([...afnResultado.Alfabeto, ...afn.Alfabeto]);
    
            // Agregar los estados de aceptación del AFN actual al conjunto de estados de aceptación del AFN resultado
            afnResultado.Edos_Acept = new Set([...afnResultado.Edos_Acept, ...afn.Edos_Acept]);
        }
    
        // Establecer el nuevo estado inicial
        afnResultado.Edo_Inicial = nuevoEstadoInicial;
        afnResultado.Estados.add(nuevoEstadoInicial);
    
        return afnResultado;
    };
    

    convertirAFD() {
        const conjuntosEstados = new Map();
        const colaPendientes = [];
        let idEstadoAFD = 0;
    
        this.matrizTransicionAFD = []; // Inicializar como un arreglo vacío
    
        // Cerradura epsilon del estado inicial del AFN
        const cerraduraInicial = AFN.Cerradura_Epsilon(this.Edo_Inicial);
        const identificadorEstadoInicial = [...cerraduraInicial].map(estado => estado.Id_Edo).sort().join(",");
        const conjuntoInicial = new ConjuntoDeEstados(cerraduraInicial, idEstadoAFD++);
    
        conjuntosEstados.set(identificadorEstadoInicial, conjuntoInicial);
        colaPendientes.push(conjuntoInicial);
    
        while (colaPendientes.length > 0) {
            const conjuntoActual = colaPendientes.shift();
    
            // Asegurarse de que la fila para el estado actual está inicializada
            if (!this.matrizTransicionAFD[conjuntoActual.Id]) {
                this.matrizTransicionAFD[conjuntoActual.Id] = Array(257).fill(-1);
            }
    
            for (let i = 0; i < 256; i++) { // Para cada símbolo ASCII
                const simbolo = String.fromCharCode(i);
                if (!this.Alfabeto.has(simbolo)) continue;
    
                const mover = AFN.ir_a(conjuntoActual.Estados, simbolo);
                if (mover.size === 0) continue;
    
                const cerraduraMover = AFN.Cerradura(mover);
                if (cerraduraMover.size === 0) continue;
    
                const identificadorConjunto = [...cerraduraMover].map(estado => estado.Id_Edo).sort().join(",");
    
                let conjuntoDestino;
                if (!conjuntosEstados.has(identificadorConjunto)) {
                    conjuntoDestino = new ConjuntoDeEstados(cerraduraMover, idEstadoAFD++);
    
                    conjuntosEstados.set(identificadorConjunto, conjuntoDestino);
                    colaPendientes.push(conjuntoDestino);
    
                    // Asegurarse de que la fila para el estado destino está inicializada
                    if (!this.matrizTransicionAFD[conjuntoDestino.Id]) {
                        this.matrizTransicionAFD[conjuntoDestino.Id] = Array(257).fill(-1);
                    }
                } else {
                    conjuntoDestino = conjuntosEstados.get(identificadorConjunto);
                }
    
                // Registrar la transición en la matriz
                this.matrizTransicionAFD[conjuntoActual.Id][i] = conjuntoDestino.Id;
            }
    
            // Marcar los estados de aceptación con su token
            this.matrizTransicionAFD[conjuntoActual.Id][256] = conjuntoActual.Token;
        }
    }
    
    

    imprimirMatrizAFD() {
        console.log('Tabla de Transición del AFD:');
        const headers = ['Estado'].concat(
            Array.from({ length: 256 }, (_, i) => String.fromCharCode(i)),
            ['Token']
        );
    
        const tabla = this.matrizTransicionAFD.map((fila, index) => {
            const transiciones = fila.slice(0, 256);
            const token = fila[256];
            return [index].concat(transiciones, token);
        });
    
        console.table(tabla);
    }    

    generarContenidoArchivo() {
        let contenido = '';

        for (let i = 0; i < this.matrizTransicionAFD.length; i++) {
            const fila = this.matrizTransicionAFD[i];
            if (!fila) continue; // En caso de que haya filas no inicializadas

            // Incluir el número de estado en la primera columna
            const valoresFila = [i.toString()].concat(fila.map(valor => valor.toString()));
            contenido += valoresFila.join(',') + '\n';
        }

        return contenido;
    }
}

async function iniciarDescarga(contenido, nombreArchivo) {
    // Configuración del tipo de archivo y nombre sugerido
    const opciones = {
        suggestedName: nombreArchivo,
        types: [
            {
                description: 'Archivo de texto',
                accept: {
                    'text/plain': ['.txt'],
                },
            },
        ],
    };

    try {
        // Mostrar el cuadro de diálogo "Guardar como"
        const handle = await window.showSaveFilePicker(opciones);

        // Crear un Stream de escritura
        const writableStream = await handle.createWritable();

        // Escribir el contenido en el archivo
        await writableStream.write(contenido);

        // Cerrar el Stream
        await writableStream.close();

        mostrarNotificacion('Archivo guardado exitosamente.', 'success');
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error al guardar el archivo:', error);
            mostrarNotificacion('Error al guardar el archivo: ', 'error');
        } else {
            // El usuario canceló la operación
            console.log('Guardado de archivo cancelado por el usuario.');
        }
    }
}


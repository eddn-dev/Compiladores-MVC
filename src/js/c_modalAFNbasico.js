// Función para manejar la creación de un AFN básico
function handleCrearAFNBasico(modal) {
    const config = {
        fields: [
            {
                name: 'automatonId',
                selector: '#automaton-id',
                alertSelector: '#automaton-id-alert',
                validate: (value) => {
                    if (!value) {
                        return 'El ID es obligatorio.';
                    } else if (!/^[0-9]+$/.test(value)) {
                        return 'El ID solo puede contener números.';
                    } else if (AFNS.some(afn => afn.ID_AFN === value)) {
                        return 'El ID ya existe. Elige otro.';
                    }
                    return null;
                }
            },
            {
                name: 'startSymbol',
                selector: '#start-symbol',
                alertSelector: '#start-symbol-alert',
                validate: (value) => {
                    if (!value) {
                        return 'El símbolo de inicio es obligatorio.';
                    } else if (!esCaracterValido(value)) {
                        return 'El símbolo de inicio debe ser un carácter válido.';
                    }
                    return null;
                }
            },
            {
                name: 'endSymbol',
                selector: '#end-symbol',
                alertSelector: '#end-symbol-alert',
                validate: (value, fields) => {
                    const startSymbol = fields['startSymbol'].value;
                    if (value) {
                        if (!esCaracterValido(value)) {
                            return 'El símbolo de final debe ser un carácter válido o estar vacío.';
                        } else if (startSymbol && startSymbol > value) {
                            return 'El símbolo final no puede ser menor que el símbolo inicial (valor ASCII).';
                        }
                    }
                    return null;
                }
            }
        ],
        onSubmit: (fields, form) => {
            const automatonId = fields['automatonId'].value.trim();
            const startSymbol = fields['startSymbol'].value;
            const endSymbol = fields['endSymbol'].value || null;

            // Crear el AFN usando tus clases
            let nuevoAFN = AFN.Crear_Basico_AFN(startSymbol, endSymbol);
            nuevoAFN.ID_AFN = automatonId; // Asignar el ID personalizado

            // Aplicar cerradura si es necesario
            const cerradura = form.querySelector('input[name="cerradura"]:checked').value;
            switch(cerradura) {
                case 'kleene':
                    nuevoAFN.Cerradura_Kleene();
                    break;
                case 'epsilon':
                    nuevoAFN.Cerradura_Positiva();
                    break;
                // 'default' no hace nada
            }

            // Añadir el nuevo AFN al arreglo global
            AFNS.push(nuevoAFN);

            // Convertir el AFN a formato Cytoscape
            let elementosCytoscape = nuevoAFN.convertirACytoscape();

            // Inicializar Cytoscape en el div con id "1"
            var cy = cytoscape({
              container: document.getElementById('1'), 
              elements: elementosCytoscape,
              style: [ // Estilos para los nodos y aristas
                {
                  selector: 'node',
                  style: {
                    'label': 'data(label)',
                    'background-color': '#666', // Color de fondo del nodo
                    'color': '#fff', // Color del texto del nodo
                    'text-valign': 'center', // Alineación vertical del texto
                    'width': '40px', // Ancho del nodo
                    'height': '40px' // Alto del nodo
                  }
                },
                {
                  selector: 'edge',
                  style: {
                    'label': 'data(label)',
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'width': 2, // Grosor de la arista
                    'line-color': '#9dbaea', // Color de la arista
                    'target-arrow-color': '#9dbaea' // Color de la flecha
                  }
                },
                {
                  selector: '.estadoAceptacion', // Estilo para los estados de aceptación
                  style: {
                    'background-color': '#c0392b', // Color de fondo rojo
                    'shape': 'star' 
                  }
                }
              ],
              layout: { // Define el diseño del grafo
                name: 'grid', // Puedes usar otros layouts como 'circle', 'breadthfirst', etc.
                rows: 2 // Número de filas en la cuadrícula
              }
            });

            // Actualizar interfaces si es necesario (por ejemplo, listas de selección)
            actualizarSelectsDeAFN();
        },
        successMessage: 'AFN básico creado exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}
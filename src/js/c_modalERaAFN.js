async function cargarAutomataDesdeArchivo(rutaArchivo) {
    try {
        const response = await fetch(rutaArchivo);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo: ${response.statusText}`);
        }
        const contenido = await response.text();

        // Parsear el contenido del archivo para obtener la matriz de transición
        const matrizTransicionAFD = parseAFDFile(contenido);
        return matrizTransicionAFD;
    } catch (error) {
        console.error('Error al cargar el autómata:', error);
        throw error;
    }
}

// Función para parsear el contenido del archivo y obtener la matriz de transición
function parseAFDFile(contenido) {
    const lines = contenido.split('\n').filter(line => line.trim() !== '');
    const matrizTransicionAFD = [];

    for (let i = 0; i < lines.length; i++) {
        const valoresFila = lines[i].split(',');

        if (valoresFila.length !== 258) {
            throw new Error(`La línea ${i + 1} no tiene 258 columnas.`);
        }

        const fila = valoresFila.map(valor => parseInt(valor.trim()));

        // Verificar que los valores sean enteros válidos
        if (fila.some(valor => isNaN(valor))) {
            throw new Error(`Valores inválidos en la línea ${i + 1}.`);
        }

        matrizTransicionAFD.push(fila);
    }

    return matrizTransicionAFD;
}

function handleAplicarERaAFN(modal) {
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
                    } else if (parseInt(value) < 0) {
                        return 'El ID debe ser un número positivo.';
                    } else if (AFNS.some(afn => afn.ID_AFN === value)) {
                        return 'El ID ya existe. Elige otro.';
                    }
                    return null;
                }
            },
            {
                name: 'regexInput',
                selector: '#regex-input',
                alertSelector: '#regex-input-alert',
                validate: (value) => {
                    if (value === null || value === undefined) {
                        return 'La expresión regular es obligatoria.';
                    }
                    // No usar trim(), aceptamos incluso un solo espacio
                    return null;
                }
            }
        ],
        onSubmit: async (fields, form) => {
            const automatonId = fields['automatonId'].value;
            const regexInput = fields['regexInput'].value;

            try {
                // Cargar el autómata desde el archivo
                const matrizTransicionAFD = await cargarAutomataDesdeArchivo('build/utils/ER_AFN.txt');

                // Crear una instancia del analizador sintáctico con la matriz cargada
                if (!window.expReg) {
                    // Si no existe, crearla
                    window.expReg = new ExpresionRegular('', matrizTransicionAFD);
                } else {
                    // Si ya existe, solo actualizar la matriz si es necesario
                    window.expReg.AL.matrizTransicionAFD = matrizTransicionAFD;
                }

                // Establecer la expresión regular
                window.expReg.setER(regexInput);

                // Realizar el análisis sintáctico
                if (window.expReg.parse()) {
                    // Obtener el AFN resultante
                    const nuevoAFN = window.expReg.getResult();
                    nuevoAFN.ID_AFN = automatonId; // Asignar el ID personalizado

                    // Añadir el nuevo AFN al arreglo global
                    AFNS.push(nuevoAFN);

                    // Actualizar interfaces si es necesario (por ejemplo, listas de selección)
                    actualizarSelectsDeAFN();

                    mostrarNotificacion('AFN generado exitosamente a partir de la expresión regular.', 'success');
                    closeModal(modal); // Cerrar el modal
                } else {
                    mostrarNotificacion('Error en el análisis de la expresión regular. Verifique la sintaxis.', 'error');
                }
            } catch (error) {
                mostrarNotificacion('Error al cargar el autómata: ' + error.message, 'error');
            }
        },
        successMessage: 'AFN generado exitosamente a partir de la expresión regular.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}

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
                    if (!value || value.trim() === '') {
                        return 'La expresión regular es obligatoria.';
                    }
                    // Opcional: agregar validaciones adicionales de la expresión regular
                    return null;
                }
            }
        ],
        onSubmit: async (fields, form) => {
            const automatonId = fields['automatonId'].value;
            const regexInput = fields['regexInput'].value;

            try {
                // Asegurarnos de que el autómata esté cargado
                await cargarAutomataERaAFN();

                // Crear una instancia del analizador sintáctico con la matriz cargada
                const expReg = new ExpresionRegular(regexInput, matrizTransicionAFD_Cache);

                // Realizar el análisis sintáctico
                if (expReg.parse()) {
                    // Obtener el AFN resultante
                    const nuevoAFN = expReg.getResult();
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

    // Variables para almacenar la matriz cargada y evitar recargas innecesarias
    let matrizTransicionAFD_Cache = null;

    // Función para cargar el autómata desde el archivo (solo una vez)
    async function cargarAutomataERaAFN() {
        if (!matrizTransicionAFD_Cache) {
            try {
                // Cargar el autómata desde el archivo
                matrizTransicionAFD_Cache = await cargarAutomataDesdeArchivo('build/utils/ER_AFN.txt');
            } catch (error) {
                console.error('Error al cargar el autómata:', error);
                throw error;
            }
        }
    }

    // Cargar el autómata al abrir el modal
    cargarAutomataERaAFN().catch(error => {
        mostrarNotificacion('Error al cargar el autómata: ' + error.message, 'error');
    });

    // Previsualización del resultado
    const regexInputElement = modal.querySelector('#regex-input');
    const automatonIdInput = modal.querySelector('#automaton-id');

    async function updateResultPreview() {
        const regexInput = regexInputElement.value;
        const automatonId = automatonIdInput.value;

        // Validar que se haya ingresado una expresión regular
        if (regexInput && regexInput.trim() !== '') {
            try {
                // Asegurarnos de que el autómata esté cargado
                await cargarAutomataERaAFN();

                // Crear una instancia del analizador sintáctico con la matriz cargada
                const expReg = new ExpresionRegular(regexInput, matrizTransicionAFD_Cache);

                // Realizar el análisis sintáctico
                if (expReg.parse()) {
                    // Obtener el AFN resultante
                    const previewAFN = expReg.getResult();
                    previewAFN.ID_AFN = automatonId ? automatonId : 'Preview';

                    // Actualizar la previsualización
                    updateAFNPreview('#preview-afn', previewAFN);
                } else {
                    // Limpiar la previsualización en caso de error
                    updateAFNPreview('#preview-afn', null);
                }
            } catch (error) {
                console.error('Error al generar la previsualización:', error);
                updateAFNPreview('#preview-afn', null);
            }
        } else {
            // Limpiar la previsualización si no hay expresión regular
            updateAFNPreview('#preview-afn', null);
        }
    }

    // Vincular eventos para actualizar la previsualización
    regexInputElement.addEventListener('input', updateResultPreview);
    automatonIdInput.addEventListener('input', updateResultPreview);

    // Actualizar la previsualización inicial
    updateResultPreview();
}

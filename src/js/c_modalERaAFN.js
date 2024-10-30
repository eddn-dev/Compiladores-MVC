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
                    } else if (parseInt(value) <= 0) {
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
                    // Podrías agregar validaciones adicionales aquí
                    return null;
                }
            }
        ],
        onSubmit: (fields, form) => {
            const automatonId = fields['automatonId'].value.trim();
            const regexInput = fields['regexInput'].value.trim();

            try {
                // Crear una instancia del analizador sintáctico
                const expReg = new ExpresionRegular(regexInput);

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
                mostrarNotificacion('Error al generar el AFN: ' + error.message, 'error');
            }
        },
        successMessage: 'AFN generado exitosamente a partir de la expresión regular.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}

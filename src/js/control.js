// control.js

// Arreglo global para almacenar los AFNs creados
const AFNS = [];

// Evento que se dispara cuando se carga un nuevo modal
document.addEventListener('modalLoaded', function(event) {
    const modal = event.detail.modal; // Referencia al modal cargado
    handleModal(modal);
});

// Función para manejar la lógica de cada modal
function handleModal(modal) {
    const modalId = modal.getAttribute('id');

    switch (modalId) {
        case 'modal8':
            handleCrearAFNBasico(modal);
            break;
        case 'modal9':
            handleUnirAFN(modal);
            break;
        case 'modal10':
            handleConcatenarAFN(modal);
            break;
        case 'modal11':
            handleAplicarCerraduraKleene(modal);
            break;
        case 'modal12':
            handleAplicarCerraduraPositiva(modal);
            break;
        case 'modal13':
            handleAplicarOpcional(modal);
            break;
        // Puedes agregar más casos si lo necesitas
    }
}

// Función genérica para manejar los modales de AFN
function handleAFNModal(modal, config) {
    const form = modal.querySelector('form');
    const acceptButton = form.querySelector('.modal_button.accept');
    const cancelButton = form.querySelector('.modal_button.cancel');

    const alertMessages = {};
    const formFields = {};

    // Seleccionar los campos y mensajes de alerta basados en la configuración
    config.fields.forEach(field => {
        formFields[field.name] = form.querySelector(field.selector);
        if (field.alertSelector) {
            alertMessages[field.name] = form.querySelector(field.alertSelector);
        }
    });

    // Desactivar el botón aceptar inicialmente
    acceptButton.disabled = true;

    // Llenar los selects con los AFNs disponibles si es necesario
    if (config.populateAFNSelects) {
        actualizarSelectsDeAFN(formFields);
    }

    // Validar campos en tiempo real
    form.addEventListener(config.validationEvent || 'input', () => {
        const isValid = validateFields();
        acceptButton.disabled = !isValid;
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío por defecto

        const isValid = validateFields();

        if (isValid) {
            config.onSubmit(formFields, form);
            // Puedes cerrar el modal o mostrar un mensaje de éxito
            alert(config.successMessage || 'Operación realizada exitosamente.');
            closeModal(modal); // Pasa el modal como argumento
        } else {
            alert(config.errorMessage || 'Por favor, corrige los errores antes de continuar.');
        }
    });

    // Manejar el botón cancelar
    cancelButton.addEventListener('click', () => {
        closeModal(modal);
    });

    // Función para validar los campos
    function validateFields() {
        let isValid = true;

        config.fields.forEach(field => {
            const value = formFields[field.name].value.trim();
            const alertMessage = alertMessages[field.name];

            // Resetear el mensaje de alerta
            if (alertMessage) {
                alertMessage.textContent = '';
                alertMessage.classList.remove('error');
            }

            // Validar si existe una función de validación para este campo
            if (field.validate) {
                const error = field.validate(value, formFields);
                if (error) {
                    isValid = false;
                    if (alertMessage) {
                        alertMessage.textContent = error;
                        alertMessage.classList.add('error');
                    }
                }
            }
        });

        return isValid;
    }
}

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
                    const startSymbol = fields['startSymbol'].value.trim();
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
            const startSymbol = fields['startSymbol'].value.trim();
            const endSymbol = fields['endSymbol'].value.trim() || null;

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

            // Actualizar interfaces si es necesario (por ejemplo, listas de selección)
            actualizarSelectsDeAFN();
        },
        successMessage: 'AFN básico creado exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}

// Función para manejar la unión de dos AFNs
function handleUnirAFN(modal) {
    const config = {
        fields: [
            {
                name: 'afnId1',
                selector: '#automaton-id-1',
                alertSelector: '#automaton-id-1-alert',
                validate: (value) => {
                    if (!value) {
                        return 'Selecciona un AFN.';
                    }
                    return null;
                }
            },
            {
                name: 'afnId2',
                selector: '#automaton-id-2',
                alertSelector: '#automaton-id-2-alert',
                validate: (value, fields) => {
                    const afnId1 = fields['afnId1'].value.trim();
                    if (!value) {
                        return 'Selecciona un AFN.';
                    } else if (value === afnId1) {
                        return 'Debes seleccionar un AFN diferente.';
                    }
                    return null;
                }
            }
        ],
        validationEvent: 'change',
        populateAFNSelects: true,
        onSubmit: (fields, form) => {
            const afnId1 = fields['afnId1'].value;
            const afnId2 = fields['afnId2'].value;

            // Obtener los AFNs seleccionados
            const afn1Index = AFNS.findIndex(afn => afn.ID_AFN === afnId1);
            const afn2Index = AFNS.findIndex(afn => afn.ID_AFN === afnId2);

            const afn1 = AFNS[afn1Index];
            const afn2 = AFNS[afn2Index];

            // Unir los AFNs
            afn1.Unir(afn2);

            // Aplicar cerradura si es necesario
            const cerradura = form.querySelector('input[name="cerradura"]:checked').value;
            switch(cerradura) {
                case 'kleene':
                    afn1.Cerradura_Kleene();
                    break;
                case 'epsilon':
                    afn1.Cerradura_Positiva();
                    break;
                // 'default' no hace nada
            }

            // Eliminar el AFN 2 de la lista, ya que ha sido unido al AFN 1
            AFNS.splice(afn2Index, 1);

            // Actualizar los selects en otros modales
            actualizarSelectsDeAFN();
        },
        successMessage: 'AFNs unidos exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}

// Función para manejar la concatenación de dos AFNs
function handleConcatenarAFN(modal) {
    const config = {
        fields: [
            {
                name: 'afnId1',
                selector: '#automaton-id-1',
                alertSelector: '#automaton-id-1-alert',
                validate: (value) => {
                    if (!value) {
                        return 'Selecciona un AFN.';
                    }
                    return null;
                }
            },
            {
                name: 'afnId2',
                selector: '#automaton-id-2',
                alertSelector: '#automaton-id-2-alert',
                validate: (value, fields) => {
                    const afnId1 = fields['afnId1'].value.trim();
                    if (!value) {
                        return 'Selecciona un AFN.';
                    } else if (value === afnId1) {
                        return 'Debes seleccionar un AFN diferente.';
                    }
                    return null;
                }
            }
        ],
        validationEvent: 'change',
        populateAFNSelects: true,
        onSubmit: (fields, form) => {
            const afnId1 = fields['afnId1'].value;
            const afnId2 = fields['afnId2'].value;

            // Obtener los AFNs seleccionados
            const afn1Index = AFNS.findIndex(afn => afn.ID_AFN === afnId1);
            const afn2Index = AFNS.findIndex(afn => afn.ID_AFN === afnId2);

            const afn1 = AFNS[afn1Index];
            const afn2 = AFNS[afn2Index];

            // Concatenar los AFNs
            afn1.Concatenar(afn2);

            // Aplicar cerradura si es necesario
            const cerradura = form.querySelector('input[name="cerradura"]:checked').value;
            switch(cerradura) {
                case 'kleene':
                    afn1.Cerradura_Kleene();
                    break;
                case 'epsilon':
                    afn1.Cerradura_Positiva();
                    break;
                // 'default' no hace nada
            }

            // Eliminar el AFN 2 de la lista, ya que ha sido concatenado al AFN 1
            AFNS.splice(afn2Index, 1);

            // Actualizar los selects en otros modales
            actualizarSelectsDeAFN();
        },
        successMessage: 'AFNs concatenados exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}

// Función para manejar la aplicación de la cerradura de Kleene
function handleAplicarCerraduraKleene(modal) {
    const config = {
        fields: [
            {
                name: 'afnId1',
                selector: '#automaton-id-1',
                alertSelector: '#automaton-id-1-alert',
                validate: (value) => {
                    if (!value) {
                        return 'Selecciona un AFN.';
                    }
                    return null;
                }
            }
        ],
        validationEvent: 'change',
        populateAFNSelects: true,
        onSubmit: (fields, form) => {
            const afnId1 = fields['afnId1'].value;

            // Obtener el AFN seleccionado
            const afn1Index = AFNS.findIndex(afn => afn.ID_AFN === afnId1);
            const afn1 = AFNS[afn1Index];

            // Aplicar la cerradura de Kleene
            afn1.Cerradura_Kleene();

            // Actualizar los selects en otros modales
            actualizarSelectsDeAFN();
        },
        successMessage: 'Cerradura de Kleene aplicada exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}

// Función para manejar la aplicación de la cerradura positiva
function handleAplicarCerraduraPositiva(modal) {
    const config = {
        fields: [
            {
                name: 'afnId1',
                selector: '#automaton-id-1',
                alertSelector: '#automaton-id-1-alert',
                validate: (value) => {
                    if (!value) {
                        return 'Selecciona un AFN.';
                    }
                    return null;
                }
            }
        ],
        validationEvent: 'change',
        populateAFNSelects: true,
        onSubmit: (fields, form) => {
            const afnId1 = fields['afnId1'].value;

            // Obtener el AFN seleccionado
            const afn1Index = AFNS.findIndex(afn => afn.ID_AFN === afnId1);
            const afn1 = AFNS[afn1Index];

            // Aplicar la cerradura positiva
            afn1.Cerradura_Positiva();

            // Actualizar los selects en otros modales
            actualizarSelectsDeAFN();
        },
        successMessage: 'Cerradura positiva aplicada exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}

// Función para manejar la aplicación del operador opcional
function handleAplicarOpcional(modal) {
    const config = {
        fields: [
            {
                name: 'afnId1',
                selector: '#automaton-id-1',
                alertSelector: '#automaton-id-1-alert',
                validate: (value) => {
                    if (!value) {
                        return 'Selecciona un AFN.';
                    }
                    return null;
                }
            }
        ],
        validationEvent: 'change',
        populateAFNSelects: true,
        onSubmit: (fields, form) => {
            const afnId1 = fields['afnId1'].value;

            // Obtener el AFN seleccionado
            const afn1Index = AFNS.findIndex(afn => afn.ID_AFN === afnId1);
            const afn1 = AFNS[afn1Index];

            // Aplicar el operador opcional
            afn1.Opcional();

            // Actualizar los selects en otros modales
            actualizarSelectsDeAFN();
        },
        successMessage: 'Operador opcional aplicado exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}

// Función para verificar si un carácter es válido
function esCaracterValido(char) {
    // Verificar que sea un solo carácter
    if (char.length !== 1) return false;

    // Verificar que sea un carácter imprimible (evitar caracteres de control)
    const code = char.charCodeAt(0);
    return code >= 32 && code <= 126; // Rango de caracteres imprimibles en ASCII
}

// Función para cerrar el modal actual
function closeModal(modal) {
    const closeModalEvent = new CustomEvent('closeModal', {
        detail: { modal: modal }
    });
    document.dispatchEvent(closeModalEvent);
}

// Función para actualizar los selects de AFNs disponibles en otros modales
function actualizarSelectsDeAFN(formFields = null) {
    // Si no se proporcionan campos específicos, actualizamos todos los selects
    if (!formFields) {
        // Obtener todos los selects que deben contener los IDs de los AFNs
        const selects = document.querySelectorAll('select[name^="automaton-id"]');

        selects.forEach(select => {
            // Limpiar las opciones actuales
            select.innerHTML = '<option value="">Sin selección</option>';

            // Añadir las opciones disponibles
            AFNS.forEach(afn => {
                const option = document.createElement('option');
                option.value = afn.ID_AFN;
                option.textContent = afn.ID_AFN;
                select.appendChild(option);
            });
        });
    } else {
        // Actualizar los selects proporcionados
        for (const key in formFields) {
            if (formFields[key].tagName === 'SELECT') {
                const select = formFields[key];
                select.innerHTML = '<option value="">Sin selección</option>';

                AFNS.forEach(afn => {
                    const option = document.createElement('option');
                    option.value = afn.ID_AFN;
                    option.textContent = afn.ID_AFN;
                    select.appendChild(option);
                });
            }
        }
    }
}

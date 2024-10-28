// control.js

// Arreglo global para almacenar los AFNs creados
const AFNS = [];

// Evento que se dispara cuando se carga un nuevo modal
document.addEventListener('modalLoaded', function(event) {
    const modal = event.detail.modal; // Referencia al modal cargado
    handleModal(modal);
    console.log('modal' + modal.getAttribute('id'));
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
        case 'modal14':
            handleObtenerAFD(modal);
            break;
    }
}

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
            mostrarNotificacion('Operación realizada exitosamente.', 'success');
            closeModal(modal); // Pasa el modal como argumento
        } else {
            mostrarNotificacion('Por favor, corrige los errores antes de continuar.', 'error');
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

function handleObtenerAFD(modal) {
    const form = modal.querySelector('#form-obtener-afd');
    const acceptButton = form.querySelector('.modal_button.accept');
    const cancelButton = form.querySelector('.modal_button.cancel');
    const tablaAFNs = form.querySelector('#tabla-afns');
    const tablaAFNsAlert = form.querySelector('#tabla-afns-alert');

    // Función para poblar la tabla con los AFNs existentes
    function populateAFNsTable() {
        // Limpiar el contenido de la tabla
        tablaAFNs.innerHTML = '';

        if (AFNS.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.setAttribute('colspan', '3');
            cell.textContent = 'No hay AFNs disponibles.';
            row.appendChild(cell);
            tablaAFNs.appendChild(row);
            acceptButton.disabled = true;
            return;
        }

        acceptButton.disabled = false;

        // Crear una fila por cada AFN
        AFNS.forEach(afn => {
            const row = document.createElement('tr');

            // Celda ID AFN
            const cellID = document.createElement('td');
            cellID.textContent = afn.ID_AFN;
            row.appendChild(cellID);

            // Celda Unir (checkbox)
            const cellUnir = document.createElement('td');
            const checkboxUnir = document.createElement('input');
            checkboxUnir.type = 'checkbox';
            checkboxUnir.name = 'unir_afn';
            checkboxUnir.value = afn.ID_AFN;
            cellUnir.appendChild(checkboxUnir);
            row.appendChild(cellUnir);

            // Celda Token (input de texto)
            const cellToken = document.createElement('td');
            const inputToken = document.createElement('input');
            inputToken.type = 'text';
            inputToken.name = 'token_afn_' + afn.ID_AFN;
            inputToken.size = '5';
            inputToken.disabled = true; // Deshabilitado hasta que se marque el checkbox
            cellToken.appendChild(inputToken);
            row.appendChild(cellToken);

            // Fila para el mensaje de error
            const errorRow = document.createElement('tr');
            const errorCell = document.createElement('td');
            errorCell.setAttribute('colspan', '3');
            errorCell.classList.add('error-cell'); // Agregamos una clase para estilos
            errorRow.appendChild(errorCell);

            // Agregar las filas a la tabla
            tablaAFNs.appendChild(row);
            tablaAFNs.appendChild(errorRow);

            // Eventos para validar en tiempo real
            checkboxUnir.addEventListener('change', function() {
                inputToken.disabled = !this.checked;
                validateRow(checkboxUnir, inputToken, errorCell);
            });

            inputToken.addEventListener('input', function() {
                validateRow(checkboxUnir, inputToken, errorCell);
            });
        });
    }

    // Función para validar una fila
    function validateRow(checkboxUnir, inputToken, errorCell) {
        // Limpiar mensajes de error
        errorCell.textContent = '';
        inputToken.classList.remove('input-error');

        if (checkboxUnir.checked) {
            const tokenValue = inputToken.value.trim();

            if (!/^[0-9]+$/.test(tokenValue)) {
                inputToken.classList.add('input-error');
                errorCell.appendChild(createErrorMessage('El token debe ser un número entero.'));
            } else {
                // Verificar que el token no esté repetido
                const tokenNumber = parseInt(tokenValue);
                const otrosTokens = Array.from(form.querySelectorAll('input[name^="token_afn_"]'))
                    .filter(input => input !== inputToken && !input.disabled)
                    .map(input => parseInt(input.value.trim()))
                    .filter(num => !isNaN(num));

                if (otrosTokens.includes(tokenNumber)) {
                    inputToken.classList.add('input-error');
                    errorCell.appendChild(createErrorMessage('El token ya está asignado a otro AFN.'));
                }
            }
        }
    }

    // Validar todas las filas
    function validateAllRows() {
        const checkboxes = form.querySelectorAll('input[name="unir_afn"]');
        checkboxes.forEach(checkbox => {
            const afnID = checkbox.value;
            const inputToken = form.querySelector('input[name="token_afn_' + afnID + '"]');
            const errorCell = checkbox.parentElement.parentElement.nextSibling.firstChild; // La celda de error
            validateRow(checkbox, inputToken, errorCell);
        });
    }

    // Llamar a la función para poblar la tabla al cargar el modal
    populateAFNsTable();

    // Agregar evento de validación general en tiempo real
    form.addEventListener('input', function() {
        validateAllRows();
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Resetear mensajes de error generales
        tablaAFNsAlert.textContent = '';
        tablaAFNsAlert.classList.remove('error');

        let isValid = true;
        let selectedAFNs = [];

        // Validar todas las filas antes de proceder
        validateAllRows();

        // Obtener los checkboxes marcados
        const checkboxes = form.querySelectorAll('input[name="unir_afn"]:checked');

        if (checkboxes.length === 0) {
            isValid = false;
            tablaAFNsAlert.textContent = 'Debe seleccionar al menos un AFN para unir.';
            tablaAFNsAlert.classList.add('error');
        } else {
            checkboxes.forEach(checkbox => {
                const afnID = checkbox.value;
                const inputToken = form.querySelector('input[name="token_afn_' + afnID + '"]');
                const tokenValue = inputToken.value.trim();

                // Verificar si el campo tiene errores
                if (inputToken.classList.contains('input-error')) {
                    isValid = false;
                } else {
                    // Almacenar el AFN y su token
                    selectedAFNs.push({
                        afn: AFNS.find(afn => afn.ID_AFN === afnID),
                        token: parseInt(tokenValue)
                    });
                }
            });
        }

        if (isValid) {
            // Asignar tokens a los estados de aceptación de cada AFN seleccionado
            selectedAFNs.forEach(item => {
                item.afn.Edos_Acept.forEach(estado => {
                    estado.Token = item.token;
                });
            });

            // Unir los AFNs seleccionados
            const afnsToUnite = selectedAFNs.map(item => item.afn);
            const afnUnido = AFN.UnirAFNs(afnsToUnite);

            // Convertir el AFN unido a AFD
            afnUnido.convertirAFD();

            // Generar el contenido del archivo
            const contenidoArchivo = afnUnido.generarContenidoArchivo();

            // Nombre sugerido para el archivo
            const nombreArchivo = 'matriz_transicion.txt';

            // Iniciar la descarga
            iniciarDescarga(contenidoArchivo, nombreArchivo);

            // Mostrar notificación de éxito
            mostrarNotificacion('Archivo generado exitosamente.', 'success');

            closeModal(modal);
        } else {
            // Mostrar errores (ya se están mostrando en los campos correspondientes)
            mostrarNotificacion('Por favor, corrige los errores antes de continuar.', 'error');
        }
    });

    // Manejar el botón cancelar
    cancelButton.addEventListener('click', function() {
        closeModal(modal);
    });

    // Función para crear mensajes de error
    function createErrorMessage(message) {
        const small = document.createElement('small');
        small.classList.add('error-message');
        small.textContent = message;
        return small;
    }
}


// Función para mostrar una notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificationContainer = document.getElementById('notification-container');
  
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.classList.add('notification', tipo, 'scale-in-center');
  
    // Contenido de la notificación
    const mensajeHTML = `
      <h2>${tipo === 'success' ? 'Éxito' : 'Error'}</h2>
      <p>${mensaje}</p>
    `;
    notification.innerHTML = mensajeHTML;
  
    // Agregar la notificación al contenedor
    notificationContainer.appendChild(notification);
  
    // Después de 2.5 segundos, ocultar la notificación
    setTimeout(() => {
      // Agregar clase de salida
      notification.classList.remove('scale-in-center');
      notification.classList.add('scale-out-center');
  
      // Remover la notificación después de que termine la animación de salida
      notification.addEventListener('animationend', () => {
        notificationContainer.removeChild(notification);
      });
    }, 2500);
  }

  

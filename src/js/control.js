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
        case 'modal2':
            handleObtenerAFD(modal);
            break;
        case 'modal3':
            handleProbarAFD(modal);
            break;
        case 'modal4':
            handleCalculadora(modal);    
            break;
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
            handleAplicarERaAFN(modal);
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
            const value = formFields[field.name].value;
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

function esCaracterValido(char) {
    // Verificar que sea un solo carácter
    if (char.length !== 1) return false;

    // Obtener el código ASCII, incluyendo el rango extendido
    const code = char.charCodeAt(0);
    // Verificar que sea un carácter imprimible
    return code >= 32 && code <= 254;
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


  function createCytoscapeInstance(container, elements) {
    return cytoscape({
        container: container,
        elements: elements,
        style: [
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'text-valign': 'center',
                    'color': '#fff',
                    'background-color': '#666',
                    'shape': 'ellipse',
                    'width': '40px',
                    'height': '40px',
                    'font-size': '12px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'label': 'data(label)',
                    'curve-style': 'bezier',
                    'control-point-step-size': 40,
                    'target-arrow-shape': 'triangle',
                    'arrow-scale': 1.2,
                    'width': 2,
                    'line-color': '#9dbaea',
                    'target-arrow-color': '#9dbaea',
                    'font-size': '10px',
                    'text-background-color': '#fff',
                    'text-background-opacity': 1,
                    'text-background-padding': '2px',
                    'edge-text-rotation': 'autorotate'
                }
            },
            {
                selector: 'node.estadoAceptacion',
                style: {
                    'background-color': '#f39c12',
                    'shape': 'pentagon'
                }
            },
            {
                selector: 'node.estadoInicial',
                style: {
                    'background-color': '#27ae60',
                    'shape': 'star'
                }
            }
        ],
        layout: {
            name: 'breadthfirst',
            directed: true,
            padding: 10
        }
    });
}

function updateAFNPreview(containerSelector, afn) {
    const container = document.querySelector(containerSelector);

    if (!afn) {
        container.innerHTML = '';
        return;
    }

    const elementos = afn.convertirACytoscape();
    createCytoscapeInstance(container, elementos);
}

function bindAFNSelectionChange(selectSelector, previewContainerSelector) {
    const selectElement = document.querySelector(selectSelector);

    selectElement.addEventListener('change', () => {
        const afnId = selectElement.value;
        const afn = AFNS.find(afn => afn.ID_AFN === afnId);
        updateAFNPreview(previewContainerSelector, afn);
    });
}

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

function parseAFDFile(contenido) {
    const lines = contenido.split('\n').filter(line => line.trim() !== '');
    const matrizTransicionAFD = [];

    for (let i = 0; i < lines.length; i++) {
        const valoresFila = lines[i].split(',');

        // Ajusta este número según el formato de tu archivo
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

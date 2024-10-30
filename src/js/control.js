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

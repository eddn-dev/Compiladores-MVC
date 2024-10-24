// buttons.js
const modalsStack = [];

// Añadir al inicio de 'buttons.js'
document.addEventListener('closeModal', function(event) {
    const modalToClose = event.detail.modal;
    closeSpecificModal(modalToClose);
});

// Función para cerrar un modal específico
function closeSpecificModal(modalElement) {
    // Encontrar el contenedor del modal en la pila
    const index = modalsStack.findIndex(item => item.container.contains(modalElement));
    if (index !== -1) {
        const { container: modalContainer, canvas } = modalsStack.splice(index, 1)[0];

        // Restablecer el canvas si es necesario
        if (canvas) {
            const originalParent = document.querySelector(`#${canvas.id}-container`);
            if (originalParent) {
                originalParent.appendChild(canvas);

                // Restablecer estilos del canvas
                canvas.style.width = '';
                canvas.style.height = '';
                canvas.classList.remove('clicked');

                // Habilitar nuevamente los eventos de puntero en el canvas
                canvas.style.pointerEvents = '';
            }
        }

        // Remover el modal del DOM
        modalContainer.remove();

        // Si no hay más modales abiertos, remover la clase modal-open
        if (modalsStack.length === 0) {
            document.body.classList.remove('modal-open');
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const canvasElements = document.querySelectorAll('.sphere_button');

    canvasElements.forEach((canvas) => {
        canvas.addEventListener('click', () => {
            const canvasId = canvas.id;
            const modalNumber = canvasId.replace('sphere', '');
            const modalUrl = `/modal${modalNumber}`;

            openModal(modalUrl, canvas);
        });
    });

    // Función para abrir un modal
    function openModal(modalUrl, canvas = null) {
        fetch(modalUrl)
            .then(response => response.text())
            .then(html => {
                // Crear un nuevo contenedor para el modal
                const modalContainer = document.createElement('div');
                modalContainer.classList.add('modal-container');
                document.body.appendChild(modalContainer);

                // Insertar el contenido del modal en el contenedor
                modalContainer.innerHTML = html;

                // Si se proporciona un canvas, moverlo al modal
                if (canvas) {
                    const modalCanvasContainer = modalContainer.querySelector('.modal_canvas_container');
                    if (modalCanvasContainer) {
                        modalCanvasContainer.appendChild(canvas);

                        // Ajustar estilos del canvas
                        canvas.style.width = '100%';
                        canvas.style.height = '100%';
                        canvas.classList.add('clicked');

                        // Deshabilitar eventos de puntero en el canvas
                        canvas.style.pointerEvents = 'none';
                    }
                }

                // Aplicar el efecto de blur y animaciones
                document.body.classList.add('modal-open');

                // Añadir clase de animación al modal
                const blurElement = modalContainer.querySelector('.blur');
                if (blurElement) {
                    blurElement.classList.add('slide-in-fwd-center');
                }

                // Añadir el modal a la pila
                modalsStack.push({
                    container: modalContainer,
                    canvas: canvas
                });

                // Añadir event listeners para cerrar el modal
                addCloseEventListeners(modalContainer, canvas);
                const modalElement = modalContainer.querySelector('.modal');
                if (modalElement) {
                    // Disparar evento personalizado
                    const modalLoadedEvent = new CustomEvent('modalLoaded', {
                        detail: { modal: modalElement }
                    });
                    document.dispatchEvent(modalLoadedEvent);
                }
            })
            .catch(error => {
                console.error('Error al cargar el modal:', error);
            });
    }

    // Función para cerrar el modal actual
    function closeModal() {
        if (modalsStack.length === 0) return;

        const { container: modalContainer, canvas } = modalsStack.pop();

        // Remover event listeners
        removeCloseEventListeners(modalContainer);

        // Restablecer el canvas a su posición original
        if (canvas) {
            const originalParent = document.querySelector(`#${canvas.id}-container`);
            if (originalParent) {
                originalParent.appendChild(canvas);

                // Restablecer estilos del canvas
                canvas.style.width = '';
                canvas.style.height = '';
                canvas.classList.remove('clicked');

                // Habilitar nuevamente los eventos de puntero en el canvas
                canvas.style.pointerEvents = '';
            }
        }

        // Añadir clase de animación de salida al modal
        const blurElement = modalContainer.querySelector('.blur');
        if (blurElement) {
            blurElement.classList.remove('slide-in-fwd-center');
            blurElement.classList.add('slide-out-fwd-center');

            // Escuchar el final de la animación para remover el modal
            blurElement.addEventListener('animationend', function handleAnimationEnd(event) {
                if (event.animationName === 'slide-out-fwd-center') {
                    // Remover el modal del DOM
                    modalContainer.remove();
                    blurElement.removeEventListener('animationend', handleAnimationEnd);

                    // Si no hay más modales abiertos, remover la clase modal-open
                    if (modalsStack.length === 0) {
                        document.body.classList.remove('modal-open');
                    }
                }
            });
        } else {
            // Si no hay animación, simplemente remover el modal
            modalContainer.remove();

            if (modalsStack.length === 0) {
                document.body.classList.remove('modal-open');
            }
        }
    }

    // Funciones para manejar el cierre del modal
    function addCloseEventListeners(modalContainer, canvas) {
        const blurElement = modalContainer.querySelector('.blur');
        const closeButton = modalContainer.querySelector('.modal_close');
        const modalElement = modalContainer.querySelector('.modal');
        const cancelButton = modalContainer.querySelector('.modal_button.cancel'); // Seleccionar el botón Cancelar
        const buttonOptions = modalContainer.querySelectorAll('.button_option');
    
        // Definir las funciones de manejo de eventos
        function onBlurClick(event) {
            if (event.target.classList.contains('blur')) {
                closeModal();
            }
        }
    
        function onCloseButtonClick(event) {
            event.stopPropagation();
            closeModal();
        }
    
        function onCancelButtonClick(event) {
            event.preventDefault(); // Prevenir comportamiento por defecto
            closeModal();
        }
    
        function stopPropagation(event) {
            event.stopPropagation();
        }
    
        // Almacenar las funciones en el contenedor del modal para poder removerlas más tarde
        modalContainer._eventHandlers = {
            onBlurClick,
            onCloseButtonClick,
            onCancelButtonClick,
            stopPropagation,
        };
    
        // Añadir los event listeners
        if (blurElement) {
            blurElement.addEventListener('click', onBlurClick);
        }
        if (closeButton) {
            closeButton.addEventListener('click', onCloseButtonClick);
        }
        if (cancelButton) {
            cancelButton.addEventListener('click', onCancelButtonClick);
        }
        if (modalElement) {
            modalElement.addEventListener('click', stopPropagation);
        }
    
        // Añadir event listeners a las opciones del modal
        buttonOptions.forEach((button) => {
            button.addEventListener('click', () => {
                const optionId = button.getAttribute('data-option-id');
                const optionUrl = `/modal-option-${optionId}`; // Ajusta la URL según tus rutas
    
                // Abrir un nuevo modal para la opción seleccionada
                openModal(optionUrl);
            });
        });
    }
    

    function removeCloseEventListeners(modalContainer) {
        const blurElement = modalContainer.querySelector('.blur');
        const closeButton = modalContainer.querySelector('.modal_close');
        const modalElement = modalContainer.querySelector('.modal');
        const cancelButton = modalContainer.querySelector('.modal_button.cancel'); // Seleccionar el botón Cancelar
    
        // Recuperar las funciones de manejo de eventos almacenadas
        const {
            onBlurClick,
            onCloseButtonClick,
            onCancelButtonClick,
            stopPropagation,
        } = modalContainer._eventHandlers || {};
    
        // Remover los event listeners
        if (blurElement && onBlurClick) {
            blurElement.removeEventListener('click', onBlurClick);
        }
        if (closeButton && onCloseButtonClick) {
            closeButton.removeEventListener('click', onCloseButtonClick);
        }
        if (cancelButton && onCancelButtonClick) {
            cancelButton.removeEventListener('click', onCancelButtonClick);
        }
        if (modalElement && stopPropagation) {
            modalElement.removeEventListener('click', stopPropagation);
        }
    
        // Limpiar las referencias
        delete modalContainer._eventHandlers;
    }    
});

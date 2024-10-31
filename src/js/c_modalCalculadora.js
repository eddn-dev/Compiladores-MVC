document.addEventListener('modalLoaded', function(event) {
    const modal = event.detail.modal;
    handleModal(modal);
});

function handleModal(modal) {
    const modalId = modal.getAttribute('id');

    switch (modalId) {
        case 'modal4':
            handleCalculadoraModal(modal);
            break;
        // Otros casos de modales aquí...
    }
}

function handleCalculadoraModal(modal) {
    const form = modal.querySelector('form');
    const calculateButton = form.querySelector('.modal_button.calculate');
    const operationInput = form.querySelector('#text-operation');
    const alertMessage = form.querySelector('#text-operation-alert');

    // Validación y lógica de cálculo
    calculateButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // Validación del campo de operación
        if (!operationInput.value.trim()) {
            alertMessage.textContent = 'La operación es obligatoria.';
            alertMessage.classList.add('error');
            return;
        }
        alertMessage.textContent = ''; // Limpia el mensaje de alerta

        try {
            // Cargar el autómata desde archivo
            const matrizTransicionAFD = await cargarAutomataDesdeArchivo('build/utils/ER_AFN.txt');

            // Instanciar ExpresionRegular si no existe
            if (!window.expReg) {
                window.expReg = new ExpresionRegular('', matrizTransicionAFD);
            } else {
                window.expReg.AL.matrizTransicionAFD = matrizTransicionAFD;
            }

            // Establecer la operación en el autómata
            window.expReg.setER(operationInput.value);

            // Ejecutar el análisis sintáctico
            if (window.expReg.parse()) {
                mostrarNotificacion('Operación calculada exitosamente.', 'success');
                closeModal(modal); // Cerrar modal si el cálculo es exitoso
            } else {
                mostrarNotificacion('Error en la operación. Verifique la sintaxis.', 'error');
            }
        } catch (error) {
            mostrarNotificacion('Error al calcular la operación: ' + error.message, 'error');
        }
    });
}

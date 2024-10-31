// Función para manejar el modal de calculadora
function handleCalculadoraModal(modal) {
    const form = modal.querySelector('form');
    const calculateButton = form.querySelector('.modal_button.calculate');
    const operationInput = form.querySelector('#text-operation');
    const alertMessage = form.querySelector('#text-operation-alert');
    const resultOutput = modal.querySelector('#result-output'); 

    // Configurar evento de cálculo
    calculateButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Validar operación antes de proceder
        if (!validarOperacion(operationInput.value, alertMessage)) return;

        // Ejecutar el cálculo
        calcularResultado(operationInput.value, resultOutput, modal);
    });
}

// Función para validar la operación de entrada
function validarOperacion(valorOperacion, alertMessage) {
    if (!valorOperacion.trim()) {
        alertMessage.textContent = 'La operación es obligatoria.';
        alertMessage.classList.add('error');
        return false;
    }
    alertMessage.textContent = ''; // Limpia el mensaje de alerta
    return true;
}

// Función para realizar el cálculo y mostrar el resultado
function calcularResultado(operacion, resultOutput, modal) {
    cargarAutomataDesdeArchivo('build/utils/ER_AFN.txt')
        .then(matrizTransicionAFD => {
            if (!window.expReg) {
                window.expReg = new ExpresionRegular('', matrizTransicionAFD);
            } else {
                window.expReg.AL.matrizTransicionAFD = matrizTransicionAFD;
            }

            window.expReg.setER(operacion);

            if (window.expReg.parse()) {
                resultOutput.textContent = window.expReg.getResult();
                mostrarNotificacion('Operación calculada exitosamente.', 'success');
            } else {
                mostrarNotificacion('Error en la operación. Verifique la sintaxis.', 'error');
                resultOutput.textContent = 'Error en la operación';
            }
        })
        .catch(error => {
            mostrarNotificacion('Error al calcular la operación: ' + error.message, 'error');
            resultOutput.textContent = 'Error al cargar el autómata';
        });
}

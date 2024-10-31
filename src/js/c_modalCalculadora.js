function handleCalculadora(modal) {
    const form = modal.querySelector('form');
    const calculateButton = form.querySelector('.modal_button.calculate');
    const operationInput = form.querySelector('#text-operation');
    const alertMessage = form.querySelector('#text-operation-alert');
    const resultOutput = modal.querySelector('#result-output');
    const postfixOutput = modal.querySelector('#postfix-output');

    // Evento para el botón "Calcular"
    calculateButton.addEventListener('click', async () => {
        const operation = operationInput.value;

        // Limpiar resultados anteriores
        resultOutput.textContent = '';
        postfixOutput.textContent = '';
        alertMessage.textContent = '';

        try {
            // Validar entrada
            if (!operation) {
                alertMessage.textContent = 'Por favor, ingrese una operación.';
                return;
            }

            // Cargar el autómata si no está cargado
            if (!window.calculadoraAutomata) {
                const matrizTransicionAFD = await cargarAutomataDesdeArchivo('build/utils/CALCULADORA.txt');
                window.calculadoraAutomata = matrizTransicionAFD;
            }

            // Crear instancia de Calculadora
            const calculadora = new Calculadora('', window.calculadoraAutomata);
            calculadora.setSigma(operation);

            // Realizar el análisis
            if (calculadora.parse()) {
                // Obtener resultado y notación postfija
                const resultado = calculadora.getResultado();
                const postfijo = calculadora.getPostfijo();

                // Mostrar los resultados
                resultOutput.textContent = resultado;
                postfixOutput.textContent = postfijo;
            } else {
                alertMessage.textContent = 'Expresión inválida. Verifique la sintaxis.';
            }
        } catch (error) {
            console.error('Error al procesar la operación:', error);
            alertMessage.textContent = 'Ocurrió un error al procesar la operación.';
        }
    });

    // Manejar el botón de cerrar modal
    const closeButton = modal.querySelector('.modal_close');
    closeButton.addEventListener('click', () => {
        closeModal(modal);
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
    cargarAutomataDesdeArchivo('build/utils/afdCalculadora.txt')
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

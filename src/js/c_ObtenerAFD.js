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
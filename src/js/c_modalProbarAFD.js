function handleProbarAFD(modal) {
    const modalContentDinamic = modal.querySelector('.modal_content_dinamic');
    const acceptButton = modal.querySelector('.modal_button.accept');
    const cancelButton = modal.querySelector('.modal_button.cancel');

    let analizadorLexico = null;

    // Función para renderizar la interfaz inicial
    function renderInitialUI() {
        modalContentDinamic.innerHTML = ''; // Limpiar contenido

        // Crear botón "Cargar Archivo de AFD"
        const cargarAFDButton = document.createElement('button');
        cargarAFDButton.textContent = 'Cargar Archivo de AFD';
        cargarAFDButton.classList.add('modal_button');

        modalContentDinamic.appendChild(cargarAFDButton);

        // Evento para cargar el archivo de AFD
        cargarAFDButton.addEventListener('click', () => {
            cargarAFD();
        });
    }

    // Función para cargar y procesar el archivo de AFD
    function cargarAFD() {
        // Crear input para seleccionar archivo
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt'; // Aceptar solo archivos .txt

        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = function(event) {
                const contenidoArchivo = event.target.result;
                try {
                    // Parsear la matriz de transición del AFD
                    const matrizTransicionAFD = parseAFDFile(contenidoArchivo);

                    // Crear instancia del Analizador Léxico
                    analizadorLexico = new AnalizadorLexico('', matrizTransicionAFD);

                    // Renderizar la interfaz para probar el AFD
                    renderAnalysisUI();
                    mostrarNotificacion('AFD cargado exitosamente.', 'success');
                } catch (error) {
                    mostrarNotificacion('Error al cargar el AFD: ' + error.message, 'error');
                }
            };

            reader.onerror = function(event) {
                mostrarNotificacion('Error al leer el archivo.', 'error');
            };

            reader.readAsText(file);
        };

        input.click();
    }

    // Función para parsear el archivo de AFD y obtener la matriz de transición
    function parseAFDFile(contenido) {
        const lines = contenido.split('\n').filter(line => line.trim() !== '');
        const matrizTransicionAFD = [];
    
        for (let i = 0; i < lines.length; i++) {
            const valoresFila = lines[i].split(',');
    
            if (valoresFila.length !== 258) { // Cambiado de 257 a 258
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
    

    // Función para renderizar la interfaz de análisis
    function renderAnalysisUI() {
        modalContentDinamic.innerHTML = ''; // Limpiar contenido

        // Crear botón "Cambiar AFD"
        const cambiarAFDButton = document.createElement('button');
        cambiarAFDButton.textContent = 'Cambiar AFD';
        cambiarAFDButton.classList.add('modal_button');

        // Crear input para la cadena a analizar
        const cadenaInput = document.createElement('input');
        cadenaInput.type = 'text';
        cadenaInput.placeholder = 'Ingrese la cadena a analizar';
        cadenaInput.classList.add('input_text'); // Clase para aplicar estilos al input

        // Crear botón "Probar AFD"
        const probarAFDButton = document.createElement('button');
        probarAFDButton.textContent = 'Probar AFD';
        probarAFDButton.classList.add('modal_button');

        // Crear contenedor para los resultados
        const resultadosDiv = document.createElement('div');
        resultadosDiv.classList.add('resultados');

        const resultadosTable = document.createElement('table');
        resultadosTable.classList.add('tabla_resultados'); // Si deseas aplicar una clase específica

        // Crear encabezados
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const lexemaHeader = document.createElement('th');
        lexemaHeader.textContent = 'Lexema';
        const tokenHeader = document.createElement('th');
        tokenHeader.textContent = 'Token';
        headerRow.appendChild(lexemaHeader);
        headerRow.appendChild(tokenHeader);
        tableHeader.appendChild(headerRow);
        resultadosTable.appendChild(tableHeader);

        // Crear cuerpo de la tabla
        const tableBody = document.createElement('tbody');
        resultadosTable.appendChild(tableBody);

        resultadosDiv.appendChild(resultadosTable);

        // Agregar elementos al contenido dinámico del modal
        modalContentDinamic.appendChild(cambiarAFDButton);
        modalContentDinamic.appendChild(document.createElement('br'));
        modalContentDinamic.appendChild(cadenaInput);
        modalContentDinamic.appendChild(probarAFDButton);
        modalContentDinamic.appendChild(resultadosDiv);

        // Evento para cambiar el AFD cargado
        cambiarAFDButton.addEventListener('click', () => {
            analizadorLexico = null;
            renderInitialUI();
        });

        // Evento para probar el AFD con la cadena ingresada
        probarAFDButton.addEventListener('click', () => {
            const cadena = cadenaInput.value.trim();
            if (cadena === '') {
                mostrarNotificacion('Ingrese una cadena para analizar.', 'error');
                return;
            }

            // Configurar la cadena en el Analizador Léxico
            analizadorLexico.setSigma(cadena);

            // Limpiar resultados anteriores
            tableBody.innerHTML = '';

            let token;
            try {
                while ((token = analizadorLexico.yylex()) !== SimbolosEspeciales.FIN) {
                    const lexema = analizadorLexico.getLexema();

                    const row = document.createElement('tr');
                    const lexemaCell = document.createElement('td');
                    lexemaCell.textContent = lexema;
                    const tokenCell = document.createElement('td');
                    tokenCell.textContent = token;

                    row.appendChild(lexemaCell);
                    row.appendChild(tokenCell);
                    tableBody.appendChild(row);
                }

                mostrarNotificacion('Análisis completado.', 'success');
            } catch (error) {
                mostrarNotificacion('Error durante el análisis: ' + error.message, 'error');
            }
        });
    }

    // Inicializar la interfaz inicial
    renderInitialUI();

    // Manejar botones de aceptar y cancelar
    acceptButton.addEventListener('click', () => {
        closeModal(modal);
    });

    cancelButton.addEventListener('click', () => {
        closeModal(modal);
    });
}

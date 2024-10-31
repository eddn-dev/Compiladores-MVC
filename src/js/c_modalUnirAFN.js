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
            switch (cerradura) {
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

            // Actualizar la previsualización del resultado
            updateAFNPreview('#preview-result', afn1);

            mostrarNotificacion('AFNs unidos exitosamente.', 'success');
            closeModal(modal);
        },
        successMessage: 'AFNs unidos exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);

    // Inicializar las previsualizaciones de los AFNs seleccionados
    bindAFNSelectionChange('#automaton-id-1', '#preview-afn1');
    bindAFNSelectionChange('#automaton-id-2', '#preview-afn2');

    // Actualizar la previsualización del resultado cuando cambien las selecciones o la cerradura
    const select1 = modal.querySelector('#automaton-id-1');
    const select2 = modal.querySelector('#automaton-id-2');
    const cerraduraRadios = modal.querySelectorAll('input[name="cerradura"]');

    function updateResultPreview() {
        const afnId1 = select1.value;
        const afnId2 = select2.value;

        if (afnId1 && afnId2 && afnId1 !== afnId2) {
            const afn1 = AFNS.find(afn => afn.ID_AFN === afnId1);
            const afn2 = AFNS.find(afn => afn.ID_AFN === afnId2);

            // Crear copias de los AFNs para la previsualización
            const previewAFN1 = afn1.clone();
            const previewAFN2 = afn2.clone();

            // Unir las copias
            previewAFN1.Unir(previewAFN2);

            // Aplicar cerradura si es necesario
            const cerradura = modal.querySelector('input[name="cerradura"]:checked').value;
            switch (cerradura) {
                case 'kleene':
                    previewAFN1.Cerradura_Kleene();
                    break;
                case 'epsilon':
                    previewAFN1.Cerradura_Positiva();
                    break;
                // 'default' no hace nada
            }

            // Actualizar la previsualización del resultado
            updateAFNPreview('#preview-result', previewAFN1);
        } else {
            // Limpiar la previsualización del resultado
            updateAFNPreview('#preview-result', null);
        }
    }

    // Vincular eventos para actualizar la previsualización del resultado
    select1.addEventListener('change', updateResultPreview);
    select2.addEventListener('change', updateResultPreview);
    cerraduraRadios.forEach(radio => {
        radio.addEventListener('change', updateResultPreview);
    });

    // Actualizar las previsualizaciones iniciales
    updateAFNPreview('#preview-afn1', AFNS.find(afn => afn.ID_AFN === select1.value));
    updateAFNPreview('#preview-afn2', AFNS.find(afn => afn.ID_AFN === select2.value));
    updateResultPreview();
}

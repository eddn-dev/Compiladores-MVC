function handleUnirAFN(modal) {
    const config = {
        fields: [
            {
                name: 'afnId',
                selector: '#automaton-id',
                alertSelector: '#automaton-id-alert',
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
                    const afnId1 = fields['afnId'].value.trim();
                    if (value && value === afnId1) {
                        return 'Debes seleccionar un AFN diferente.';
                    }
                    return null;
                }
            }
        ],
        validationEvent: 'change',
        populateAFNSelects: true,
        onSubmit: (fields, form) => {
            const afnId = fields['afnId'].value;
            const afnId2 = fields['afnId2'].value;

            // Obtener el AFN seleccionado
            const afnIndex = AFNS.findIndex(afn => afn.ID_AFN === afnId);
            const afn = AFNS[afnIndex];

            if (afnId2 && afnId !== afnId2) {
                // Si se seleccionó un segundo AFN, realizar la unión
                const afn2Index = AFNS.findIndex(afn => afn.ID_AFN === afnId2);
                const afn2 = AFNS[afn2Index];

                // Unir los AFNs directamente
                afn.Unir(afn2);

                // Eliminar el AFN 2 de la lista, ya que se ha unido al AFN 1
                AFNS.splice(afn2Index, 1);
            }

            // Aplicar cerradura si es necesario
            const cerradura = form.querySelector('input[name="cerradura"]:checked').value;
            switch (cerradura) {
                case 'kleene':
                    afn.Cerradura_Kleene();
                    break;
                case 'epsilon':
                    afn.Cerradura_Positiva();
                    break;
                // 'default' no hace nada
            }

            // Actualizar los selects en otros modales
            actualizarSelectsDeAFN();

            mostrarNotificacion('Operación realizada exitosamente.', 'success');
            closeModal(modal);
        },
        successMessage: 'Operación realizada exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);

    // Inicializar la previsualización del AFN seleccionado
    bindAFNSelectionChange('#automaton-id', '#preview-afn');

    // Actualizar la previsualización del resultado cuando cambie la selección o la cerradura
    const select1 = modal.querySelector('#automaton-id');
    const select2 = modal.querySelector('#automaton-id-2');
    const cerraduraRadios = modal.querySelectorAll('input[name="cerradura"]');

    function updateResultPreview() {
        const afnId = select1.value;
        const afnId2 = select2.value;

        if (afnId) {
            const afn = AFNS.find(afn => afn.ID_AFN === afnId);
            let previewAFN;

            if (afnId2 && afnId !== afnId2) {
                const afn2 = AFNS.find(afn => afn.ID_AFN === afnId2);
                const cloneAFN1 = afn.clone();
                const cloneAFN2 = afn2.clone();

                cloneAFN1.Unir(cloneAFN2);
                previewAFN = cloneAFN1;
            } else {
                previewAFN = afn.clone();
            }

            // Aplicar la operación deseada
            const cerradura = modal.querySelector('input[name="cerradura"]:checked').value;
            switch (cerradura) {
                case 'kleene':
                    previewAFN.Cerradura_Kleene();
                    break;
                case 'epsilon':
                    previewAFN.Cerradura_Positiva();
                    break;
            }

            // Actualizar la previsualización del resultado
            updateAFNPreview('#preview-result', previewAFN);
        } else {
            // Limpiar la previsualización del resultado
            updateAFNPreview('#preview-result', null);
        }
    }

    // Vincular eventos para actualizar la previsualización del resultado
    select1.addEventListener('change', () => {
        updateAFNPreview('#preview-afn', AFNS.find(afn => afn.ID_AFN === select1.value));
        updateResultPreview();
    });
    select2.addEventListener('change', updateResultPreview);
    cerraduraRadios.forEach(radio => {
        radio.addEventListener('change', updateResultPreview);
    });

    // Actualizar las previsualizaciones iniciales
    updateAFNPreview('#preview-afn', AFNS.find(afn => afn.ID_AFN === select1.value));
    updateResultPreview();
}

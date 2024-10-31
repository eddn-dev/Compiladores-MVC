<div class="blur">   
    <!-- Contenido del modal -->
    <div class="modal" id="modal11">
        <button class="modal_close">&times;</button>
        <div class="modal_title">
            Cerradura de Kleene
        </div>
        <div class="modal_content">
            <div class="modal_create_layout">
                <div class="modal_automaton_previews">
                    <div class="automaton_preview" id="preview-afn"></div>
                    <div class="automaton_preview" id="preview-result"></div>
                </div>
                <div class="modal_automaton_form">
                    <form>
                        <div class="form-group">
                            <label for="automaton-id">ID del AFN a aplicar cerradura:</label>
                            <select id="automaton-id" name="automaton-id">
                                <option value="">Sin selección</option> 
                            </select>
                            <small id="automaton-id-alert" class="alert-message"></small> 
                        </div>
                        <div class="modal_buttons">
                            <button type="button" class="modal_button cancel">Cancelar</button>
                            <button type="submit" class="modal_button accept">Aceptar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>    

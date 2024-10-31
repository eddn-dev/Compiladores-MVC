<div class="blur">   
    <!-- Contenido del modal -->
    <div class="modal" id="modal9">
        <button class="modal_close">&times;</button>
        <div class="modal_title">
            Unir AFN
        </div>
        <div class="modal_content">
            <div class="modal_create_layout">
                <div class="modal_automaton_previews">
                    <div class="automaton_preview" id="preview-afn1"></div>
                    <div class="automaton_preview" id="preview-afn2"></div>
                    <div class="automaton_preview" id="preview-result"></div>
                </div>
                <div class="modal_automaton_form">
                    <form>
                        <div class="form-group">
                            <label for="automaton-id-1">ID del AFN 1:</label>
                            <select id="automaton-id-1" name="automaton-id-1">
                                <option value="">Sin selección</option> 
                                </select>
                            <small id="automaton-id-1-alert" class="alert-message"></small> 
                        </div>
                        <div class="form-group">
                            <label for="automaton-id-2">ID del AFN 2:</label>
                            <select id="automaton-id-2" name="automaton-id-2">
                                <option value="">Sin selección</option> 
                            </select>
                            <small id="automaton-id-2-alert" class="alert-message"></small> 
                        </div>
                        <div class="form-group">
                            <label>¿Aplicar cerradura?:</label>
                            <div>
                            <input type="radio" id="default" name="cerradura" value="default" checked>
                            <label for="default">Sin cerradura</label>
                            </div>
                            <div>
                            <input type="radio" id="kleene" name="cerradura" value="kleene">
                            <label for="kleene">Cerradura de Kleene</label>
                            </div>
                            <div>
                            <input type="radio" id="epsilon" name="cerradura" value="epsilon">
                            <label for="epsilon">Cerradura Épsilon</label>
                            </div>
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
<div class="blur">   
    <!-- Contenido del modal -->
    <div class="modal" id="modal8">
        <button class="modal_close">&times;</button>
        <div class="modal_title">
            Crear autómata básico
        </div>
        <div class="modal_content">
            <div class="modal_create_layout">
                <div class="modal_automaton_previews">
                    <div class="automaton_preview" id="1"></div>
                </div>
                <div class="modal_automaton_form">
                    <form>
                        <div class="form-group">
                            <label for="automaton-id">ID:</label>
                            <input type="text" id="automaton-id" name="automaton-id">
                            <small id="automaton-id-alert" class="alert-message"></small> 
                        </div>
                        <div class="form-group">
                            <label for="start-symbol">Símbolo de inicio:</label>
                            <input type="text" id="start-symbol" name="start-symbol">
                            <small id="start-symbol-alert" class="alert-message"></small>
                        </div>
                        <div class="form-group">
                            <label for="end-symbol">Símbolo de final:</label>
                            <input type="text" id="end-symbol" name="end-symbol">
                            <small id="end-symbol-alert" class="alert-message"></small>
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
                            <label for="epsilon">Cerradura Positiva</label>
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
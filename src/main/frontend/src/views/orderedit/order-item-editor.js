/**
 * `order-item-editor` é um Web Component baseado em LitElement para editar um item de encomenda.
 *
 * Funcionalidades:
 * - Seleção de produto via combo-box.
 * - Quantidade do item com `vaadin-integer-field`, com botões de incremento/decremento.
 * - Exibição de preço calculado do item.
 * - Campo de comentário para detalhes adicionais do item.
 * - Botão de exclusão do item.
 *
 * @element order-item-editor
 *
 * @slot - O componente não possui slots adicionais.
 *
 * @csspart delete - Botão de exclusão do item.
 *
 * @cssprop --vaadin-form-layout-column-spacing - Espaçamento entre colunas do layout do formulário.
 */
class OrderItemEditor extends LitElement {
    /**
     * Estilos CSS do componente.
     */
    static get styles() {
        return [
            sharedStyles,
            css`
                .product { margin-bottom: 1em; }
                .delete { min-width: 2em; padding: 0; }
                @media (max-width: 700px) {
                    vaadin-form-layout { --vaadin-form-layout-column-spacing: 1em; }
                }
                .money { text-align: right; line-height: 2.5em; }
                .self-start { align-self: flex-start; } /* IE11 workaround */
            `,
        ];
    }

    /**
     * Renderiza o template HTML do componente.
     *
     * @returns {import('lit').TemplateResult}
     */
    render() {
        return html`
            <vaadin-form-layout id="form1" .responsiveSteps="${this.form1responsiveSteps}">
                <vaadin-form-layout
                        id="form2"
                        colspan="16"
                        class="product"
                        style="flex: auto;"
                        .responsiveSteps="${this.form2responsiveSteps}"
                >
                    <vaadin-combo-box id="products" colspan="8"></vaadin-combo-box>
                    <vaadin-integer-field
                            id="amount"
                            colspan="4"
                            class="self-start"
                            min="1"
                            max="15"
                            step-buttons-visible
                            prevent-invalid-input
                    ></vaadin-integer-field>
                    <div id="price" colspan="4" class="money"></div>
                    <vaadin-text-field
                            id="comment"
                            colspan="12"
                            placeholder="Details"
                    ></vaadin-text-field>
                </vaadin-form-layout>

                <vaadin-button class="delete self-start" id="delete" colspan="2">
                    <vaadin-icon icon="vaadin:close-small"></vaadin-icon>
                </vaadin-button>
            </vaadin-form-layout>
        `;
    }

    /** Nome da tag do componente */
    static get is() { return 'order-item-editor'; }

    /**
     * Propriedades reativas do componente.
     */
    static get properties() {
        return {
            /** Passos responsivos do formulário principal */
            form1responsiveSteps: { type: Array },
            /** Passos responsivos do formulário do item */
            form2responsiveSteps: { type: Array },
        };
    }

    constructor() {
        super();
        /** @type {{ minWidth: string | 0; columns: number; labelsPosition: "top" | "aside"; }[]} */
        this.form1responsiveSteps = [{ columns: 24 }];
        /** @type {{ minWidth: string | 0; columns: number; labelsPosition: "top" | "aside"; }[]} */
        this.form2responsiveSteps = [
            { columns: 8, labelsPosition: 'top' },
            { minWidth: '500px', columns: 16, labelsPosition: 'top' },
        ];
    }
}

customElements.define(OrderItemEditor.is, OrderItemEditor);

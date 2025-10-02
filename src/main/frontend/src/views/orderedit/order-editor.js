/**
 * `order-editor` é um Web Component baseado em LitElement para criar ou editar uma encomenda.
 *
 * Funcionalidades:
 * - Campos para data/hora de entrega e localização de pickup.
 * - Campos de informação do cliente (nome, telefone e detalhes adicionais).
 * - Área para adicionar produtos à encomenda (`itemsContainer`).
 * - Combo-box para status da encomenda.
 * - Exibe o total da encomenda na barra de botões.
 * - Barra de botões (`buttons-bar`) com ações Cancelar e Review Order.
 * - Suporta sombras automáticas no scroll através de `ScrollShadowMixin`.
 *
 * @element order-editor
 * @mixes ScrollShadowMixin
 *
 * @slot - O componente não possui slots adicionais para conteúdo externo.
 *
 * @csspart footer - Barra de botões inferior.
 *
 * @cssprop --lumo-space-s - Espaçamento padrão usado na barra e formulários.
 */
class OrderEditor extends ScrollShadowMixin(LitElement) {
    /**
     * Estilos CSS do componente.
     */
    static get styles() {
        return [
            sharedStyles,
            css`
        :host { display: flex; flex-direction: column; flex: auto; }
        .meta-row { display: flex; justify-content: space-between; padding-bottom: var(--lumo-space-s); }
        .dim { color: var(--lumo-secondary-text-color); text-align: right; white-space: nowrap; line-height: 2.5em; }
        .status { width: 10em; }
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
      <div class="scrollable flex1" id="main">
        <h2 id="title">New order</h2>
        <div class="meta-row" id="metaContainer">
          <vaadin-combo-box class="status" id="status" status="${this.__toLowerCase(this.status)}"></vaadin-combo-box>
          <span class="dim">Order #<span id="orderNumber"></span></span>
        </div>

        <vaadin-form-layout id="form1" .responsiveSteps="${this.form1responsiveSteps}">
          <vaadin-form-layout id="form2" .responsiveSteps="${this.form2responsiveSteps}">
            <vaadin-date-picker label="Due" id="dueDate"></vaadin-date-picker>
            <vaadin-combo-box id="dueTime">
              <vaadin-icon slot="prefix" icon="vaadin:clock"></vaadin-icon>
            </vaadin-combo-box>
            <vaadin-combo-box id="pickupLocation" colspan="2">
              <vaadin-icon slot="prefix" icon="vaadin:at"></vaadin-icon>
            </vaadin-combo-box>
          </vaadin-form-layout>

          <vaadin-form-layout id="form3" colspan="3" .responsiveSteps="${this.form3responsiveSteps}">
            <vaadin-text-field id="customerName" label="Customer" colspan="2">
              <vaadin-icon slot="prefix" icon="vaadin:user"></vaadin-icon>
            </vaadin-text-field>
            <vaadin-text-field id="customerNumber" label="Phone number">
              <vaadin-icon slot="prefix" icon="vaadin:phone"></vaadin-icon>
            </vaadin-text-field>
            <vaadin-text-field id="customerDetails" label="Additional Details" colspan="2"></vaadin-text-field>

            <vaadin-form-item colspan="3">
              <label slot="label">Products</label>
            </vaadin-form-item>
            <div id="itemsContainer" colspan="3"></div>
          </vaadin-form-layout>
        </vaadin-form-layout>
      </div>

      <buttons-bar id="footer" no-scroll="${this.noScroll}">
        <vaadin-button slot="left" id="cancel">Cancel</vaadin-button>
        <div slot="info" class="total">Total ${this.totalPrice}</div>
        <vaadin-button slot="right" id="review" theme="primary">
          Review order
          <vaadin-icon icon="vaadin:arrow-right" slot="suffix"></vaadin-icon>
        </vaadin-button>
      </buttons-bar>
    `;
    }

    /** Nome da tag do componente */
    static get is() { return 'order-editor'; }

    /** Propriedades reativas do componente */
    static get properties() {
        return {
            /** Status atual da encomenda */
            status: { type: String },
            /** Preço total da encomenda */
            totalPrice: { type: String },
            /** Passos responsivos para o layout do formulário principal */
            form1responsiveSteps: { type: Array },
            /** Passos responsivos para o layout do formulário secundário */
            form2responsiveSteps: { type: Array },
            /** Passos responsivos para o layout do formulário de cliente/produtos */
            form3responsiveSteps: { type: Array },
        };
    }

    constructor() {
        super();
        /** @type {{ minWidth: string | 0; columns: number; labelsPosition: "top" | "aside"; }[]} */
        this.form1responsiveSteps = [
            { columns: 1, labelsPosition: 'top' },
            { minWidth: '600px', columns: 4, labelsPosition: 'top' },
        ];
        this.form2responsiveSteps = [
            { columns: 1, labelsPosition: 'top' },
            { minWidth: '360px', columns: 2, labelsPosition: 'top' },
        ];
        this.form3responsiveSteps = [
            { columns: 1, labelsPosition: 'top' },
            { minWidth: '500px', columns: 3, labelsPosition: 'top' },
        ];
    }

    /**
     * Converte o status para letras minúsculas.
     * @param {string} status - Status da encomenda
     * @returns {string} - Status em minúsculas
     */
    __toLowerCase(status) {
        return status ? status.toLowerCase() : '';
    }
}

customElements.define(OrderEditor.is, OrderEditor);

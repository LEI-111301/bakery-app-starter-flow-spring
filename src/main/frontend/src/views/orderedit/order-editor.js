/**
 * @module OrderEditor
 * @description
 * Componente web responsável por **criar e editar pedidos** (orders) dentro da aplicação.
 *
 * Baseado em [`LitElement`](https://lit.dev/docs/api/LitElement/) e no `ScrollShadowMixin`,
 * este componente fornece uma interface completa para entrada de dados de um pedido,
 * incluindo informações do cliente, data e hora de entrega, local de retirada,
 * status do pedido e lista de produtos.
 *
 * Utiliza a biblioteca **Vaadin** para formulários, campos e layout responsivo,
 * além de componentes personalizados como `<buttons-bar>` e `<order-item-editor>`.
 *
 * ---
 * ### Principais recursos:
 * - Edição de dados de cliente e informações de entrega;
 * - Seleção de status do pedido via `<vaadin-combo-box>`;
 * - Formulários totalmente responsivos;
 * - Cálculo e exibição do total do pedido;
 * - Barra de ações inferior com botões de cancelar e revisar o pedido.
 *
 * ---
 * @example
 * ```html
 * <order-editor
 *   status="New"
 *   totalPrice="€125.00">
 * </order-editor>
 * ```
 *
 * @extends {ScrollShadowMixin(LitElement)}
 */
import { html, css, LitElement } from 'lit';
import '@vaadin/icons/vaadin-icons.js';
import '@vaadin/text-field';
import '@vaadin/button';
import '@vaadin/combo-box';
import '@vaadin/date-picker';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item.js';
import '@vaadin/icon';
import '@vaadin/icons';
import '../../components/buttons-bar.js';
import { ScrollShadowMixin } from '../../components/utils-mixin.js';
import './order-item-editor.js';
import { sharedStyles } from '../../../styles/shared-styles.js';

class OrderEditor extends ScrollShadowMixin(LitElement) {
  /**
   * Estilos aplicados ao componente.
   * Inclui estilos compartilhados (`sharedStyles`) e ajustes para layout responsivo.
   *
   * @returns {CSSResultGroup}
   */
  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          flex: auto;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: var(--lumo-space-s);
        }

        .dim {
          color: var(--lumo-secondary-text-color);
          text-align: right;
          white-space: nowrap;
          line-height: 2.5em;
        }

        .status {
          width: 10em;
        }
      `,
    ];
  }

  /**
   * Renderiza o layout principal do editor de pedidos.
   *
   * Estrutura:
   * - **Cabeçalho** com título e número do pedido;
   * - **Formulário principal** com dados de entrega e cliente;
   * - **Lista de produtos**, editável por meio de `<order-item-editor>`;
   * - **Rodapé** com total e botões de ação.
   *
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <div class="scrollable flex1" id="main">
        <h2 id="title">New order</h2>

        <!-- Cabeçalho com status e número do pedido -->
        <div class="meta-row" id="metaContainer">
          <vaadin-combo-box
            class="status"
            id="status"
            status="${this.__toLowerCase(this.status)}"
          ></vaadin-combo-box>
          <span class="dim">Order #<span id="orderNumber"></span></span>
        </div>

        <!-- Formulário principal -->
        <vaadin-form-layout
          id="form1"
          .responsiveSteps="${this.form1responsiveSteps}"
        >
          <!-- Data e local -->
          <vaadin-form-layout
            id="form2"
            .responsiveSteps="${this.form2responsiveSteps}"
          >
            <vaadin-date-picker label="Due" id="dueDate"></vaadin-date-picker>

            <vaadin-combo-box id="dueTime">
              <vaadin-icon slot="prefix" icon="vaadin:clock"></vaadin-icon>
            </vaadin-combo-box>

            <vaadin-combo-box id="pickupLocation" colspan="2">
              <vaadin-icon slot="prefix" icon="vaadin:at"></vaadin-icon>
            </vaadin-combo-box>
          </vaadin-form-layout>

          <!-- Cliente e produtos -->
          <vaadin-form-layout
            id="form3"
            colspan="3"
            .responsiveSteps="${this.form3responsiveSteps}"
          >
            <vaadin-text-field id="customerName" label="Customer" colspan="2">
              <vaadin-icon slot="prefix" icon="vaadin:user"></vaadin-icon>
            </vaadin-text-field>

            <vaadin-text-field id="customerNumber" label="Phone number">
              <vaadin-icon slot="prefix" icon="vaadin:phone"></vaadin-icon>
            </vaadin-text-field>

            <vaadin-text-field
              id="customerDetails"
              label="Additional Details"
              colspan="2"
            ></vaadin-text-field>

            <vaadin-form-item colspan="3">
              <label slot="label">Products</label>
            </vaadin-form-item>

            <!-- Container para produtos -->
            <div id="itemsContainer" colspan="3"></div>
          </vaadin-form-layout>
        </vaadin-form-layout>
      </div>

      <!-- Rodapé -->
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

  /**
   * Nome do custom element.
   * @readonly
   * @returns {string}
   */
  static get is() {
    return 'order-editor';
  }

  /**
   * Propriedades reativas do componente.
   *
   * @property {string} status - Status atual do pedido (por exemplo, `"New"`, `"Pending"`, `"Completed"`).
   * @property {string} totalPrice - Valor total do pedido formatado (por exemplo, `"€125.00"`).
   * @property {Array<Object>} form1responsiveSteps - Configuração de responsividade do primeiro layout de formulário.
   * @property {Array<Object>} form2responsiveSteps - Configuração de responsividade do segundo layout de formulário.
   * @property {Array<Object>} form3responsiveSteps - Configuração de responsividade do terceiro layout de formulário.
   */
  static get properties() {
    return {
      status: { type: String },
      totalPrice: { type: String },
      form1responsiveSteps: { type: Array },
      form2responsiveSteps: { type: Array },
      form3responsiveSteps: { type: Array },
    };
  }

  /**
   * Construtor do componente.
   * Inicializa as configurações responsivas dos formulários (`form1`, `form2`, `form3`).
   */
  constructor() {
    super();

    /** @type {{ minWidth?: string; columns: number; labelsPosition: "top" | "aside"; }[]} */
    this.form1responsiveSteps = [
      { columns: 1, labelsPosition: 'top' },
      { minWidth: '600px', columns: 4, labelsPosition: 'top' },
    ];

    /** @type {{ minWidth?: string; columns: number; labelsPosition: "top" | "aside"; }[]} */
    this.form2responsiveSteps = [
      { columns: 1, labelsPosition: 'top' },
      { minWidth: '360px', columns: 2, labelsPosition: 'top' },
    ];

    /** @type {{ minWidth?: string; columns: number; labelsPosition: "top" | "aside"; }[]} */
    this.form3responsiveSteps = [
      { columns: 1, labelsPosition: 'top' },
      { minWidth: '500px', columns: 3, labelsPosition: 'top' },
    ];
  }

  /**
   * Converte o status do pedido para letras minúsculas.
   *
   * Útil para aplicação de estilos condicionais com base no valor de `status`.
   *
   * @param {string} status - O status atual do pedido.
   * @returns {string} O status convertido em minúsculas ou string vazia.
   * @private
   */
  __toLowerCase(status) {
    return status ? status.toLowerCase() : '';
  }
}

customElements.define(OrderEditor.is, OrderEditor);

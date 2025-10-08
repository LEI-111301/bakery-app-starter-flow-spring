/**
 * @module OrderDetails
 * @description
 * Componente web que representa a **visualização detalhada de um pedido** em um painel de controle (dashboard) ou loja online.
 *
 * Baseado em [`LitElement`](https://lit.dev/docs/api/LitElement/) e no `ScrollShadowMixin`, este componente exibe:
 * - Informações gerais do pedido (cliente, data de entrega, local de retirada, status);
 * - Lista de produtos do pedido;
 * - Histórico de atualizações do pedido;
 * - Campo de comentário para adicionar observações;
 * - Barra de botões para ações contextuais (voltar, cancelar, editar ou confirmar).
 *
 * Utiliza componentes do Vaadin, como:
 * - `<vaadin-form-layout>` para formulários responsivos;
 * - `<vaadin-button>` e `<vaadin-icon>` para ações;
 * - `<order-status-badge>` para status visual do pedido;
 * - `<buttons-bar>` para controle de navegação e ações inferiores.
 *
 * @example
 * ```html
 * <order-details
 *   .item="${orderData}"
 *   .review="${false}">
 * </order-details>
 * ```
 *
 * @extends {ScrollShadowMixin(LitElement)}
 */
import { html, css, LitElement } from 'lit';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';
import '@vaadin/icons/vaadin-icons.js';
import '@vaadin/button';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item.js';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/text-field';
import '../../components/buttons-bar.js';
import { ScrollShadowMixin } from '../../components/utils-mixin.js';
import '../storefront/order-status-badge.js';
import { sharedStyles } from '../../../styles/shared-styles.js';

class OrderDetails extends ScrollShadowMixin(LitElement) {
  /**
   * Estilos aplicados ao componente.
   * Inclui estilos compartilhados (`sharedStyles`) e layout responsivo.
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
          box-sizing: border-box;
          flex: auto;
        }

        .table {
          display: table;
        }

        .tr {
          display: table-row;
        }

        .td {
          display: table-cell;
        }

        .main-row {
          flex: 1;
        }

        h3 {
          margin: 0;
          word-break: break-word;
          white-space: normal;
        }

        .date,
        .time {
          white-space: nowrap;
        }

        .dim,
        .secondary {
          color: var(--lumo-secondary-text-color);
        }

        .secondary {
          font-size: var(--lumo-font-size-xs);
          line-height: var(--lumo-font-size-xl);
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: var(--lumo-space-s);
        }

        .products {
          width: 100%;
        }

        .products .td {
          text-align: center;
          vertical-align: middle;
          padding: var(--lumo-space-xs);
          border-bottom: 1px solid var(--lumo-contrast-10pct);
        }

        .products .td.product-name {
          text-align: left;
          padding-left: 0;
          width: 100%;
        }

        .products .td.number {
          text-align: right;
        }

        .products .td.money {
          text-align: right;
          padding-right: 0;
        }

        .history-line {
          margin: var(--lumo-space-xs) 0;
        }

        .comment {
          font-size: var(--lumo-font-size-s);
        }

        order-status-badge[small] {
          margin-left: 0.5em;
        }

        #sendComment {
          color: var(--lumo-primary-color-50pct);
        }

        @media (min-width: 600px) {
          .main-row {
            padding: var(--lumo-space-l);
          }
        }
      `,
    ];
  }

  /**
   * Renderiza o conteúdo do componente, incluindo:
   * - Cabeçalho com status e número do pedido;
   * - Seções de dados do pedido (cliente, data, local);
   * - Lista de produtos e histórico de eventos;
   * - Campo de comentário;
   * - Barra de botões para ações.
   *
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <div class="scrollable main-row" id="main">
        <!-- Cabeçalho e status -->
        <div class="meta-row">
          <order-status-badge
            .status="${this.item && this.item.state}"
          ></order-status-badge>
          <span class="dim">Order #${this.item && this.item.id}</span>
        </div>

        <!-- Informações principais -->
        <vaadin-form-layout
          id="form1"
          .responsiveSteps="${this.form1responsiveSteps}"
        >
          <vaadin-form-item>
            <label slot="label">Due</label>
            <vaadin-form-layout
              id="form2"
              .responsiveSteps="${this.form2responsiveSteps}"
            >
              <div class="date">
                <h3>${this.item?.formattedDueDate.day}</h3>
                <span class="dim">${this.item?.formattedDueDate.weekday}</span>
              </div>
              <div class="time">
                <h3>${this.item?.formattedDueTime}</h3>
                <span class="dim">${this.item?.pickupLocation.name}</span>
              </div>
            </vaadin-form-layout>
          </vaadin-form-item>

          <vaadin-form-item colspan="2">
            <label slot="label">Customer</label>
            <h3>${this.item?.customer.fullName}</h3>
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Phone number</label>
            <h3>${this.item?.customer.phoneNumber}</h3>
          </vaadin-form-item>
        </vaadin-form-layout>

        <!-- Produtos e histórico -->
        <vaadin-form-layout
          id="form3"
          .responsiveSteps="${this.form3responsiveSteps}"
        >
          <div></div>
          <vaadin-form-layout
            id="form4"
            colspan="2"
            .responsiveSteps="${this.form4responsiveSteps}"
          >
            ${when(this.item?.customer.details, () => html`
              <vaadin-form-item label-position="top">
                <label slot="label">Additional details</label>
                <span>${this.item.customer.details}</span>
              </vaadin-form-item>
            `)}

            <!-- Lista de produtos -->
            <vaadin-form-item>
              <label slot="label">Products</label>
              <div class="table products">
                ${this.item &&
                map(this.item.items, (item) => html`
                  <div class="tr">
                    <div class="td product-name">
                      <div class="bold">${item.product.name}</div>
                      <div class="secondary">${item.comment}</div>
                    </div>
                    <div class="td number">${item.quantity}</div>
                    <div class="td dim">×</div>
                    <div class="td money">${item.product.formattedPrice}</div>
                  </div>
                `)}
              </div>
            </vaadin-form-item>

            <!-- Histórico -->
            <vaadin-form-item id="history" label-position="top" .hidden="${this.review}">
              <label slot="label">History</label>
              ${this.item &&
              map(this.item.history, (event) => html`
                <div class="history-line">
                  <span class="bold">${event.createdBy.firstName}</span>
                  <span class="secondary">${event.formattedTimestamp}</span>
                  <order-status-badge .status="${event.newState}" small></order-status-badge>
                </div>
                <div class="comment">${event.message}</div>
              `)}
            </vaadin-form-item>

            <!-- Comentário -->
            <vaadin-form-item id="comment" .hidden="${this.review}">
              <vaadin-text-field
                id="commentField"
                placeholder="Add comment"
                class="full-width"
                @keydown="${this._onCommentKeydown}"
                maxlength="255"
              >
                <div slot="suffix" class="comment-suffix">
                  <vaadin-button id="sendComment" theme="tertiary">
                    Send
                  </vaadin-button>
                </div>
              </vaadin-text-field>
            </vaadin-form-item>
          </vaadin-form-layout>
        </vaadin-form-layout>
      </div>

      <!-- Rodapé -->
      <buttons-bar id="footer" no-scroll="${this.noScroll}">
        <vaadin-button slot="left" id="back" .hidden="${!this.review}">
          Back
        </vaadin-button>
        <vaadin-button slot="left" id="cancel" .hidden="${this.review}">
          Cancel
        </vaadin-button>

        <div slot="info" class="total">
          Total ${this.item?.formattedTotalPrice}
        </div>

        <vaadin-button slot="right" id="save" theme="primary success" .hidden="${!this.review}">
          <vaadin-icon icon="vaadin:check" slot="suffix"></vaadin-icon>
          Place order
        </vaadin-button>
        <vaadin-button slot="right" id="edit" theme="primary" .hidden="${this.review}">
          Edit order
          <vaadin-icon icon="vaadin:edit" slot="suffix"></vaadin-icon>
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
    return 'order-details';
  }

  /**
   * Declaração das propriedades observáveis do componente.
   *
   * @property {Object} item - Dados completos do pedido, incluindo cliente, produtos e histórico.
   * @property {boolean} review - Indica se o componente está no modo de revisão (true) ou edição (false).
   * @property {Array} form1responsiveSteps - Configuração de responsividade do primeiro formulário.
   * @property {Array} form2responsiveSteps - Configuração de responsividade do segundo formulário.
   * @property {Array} form3responsiveSteps - Configuração de responsividade do terceiro formulário.
   * @property {Array} form4responsiveSteps - Configuração de responsividade do quarto formulário.
   */
  static get properties() {
    return {
      item: { type: Object },
      review: { type: Boolean },
      form1responsiveSteps: { type: Array },
      form2responsiveSteps: { type: Array },
      form3responsiveSteps: { type: Array },
    };
  }

  /**
   * Construtor do componente.
   * Inicializa os layouts responsivos dos formulários.
   */
  constructor() {
    super();
    this.form1responsiveSteps = this.form3responsiveSteps = [
      { columns: 1, labelsPosition: 'top' },
      { minWidth: '600px', columns: 4, labelsPosition: 'top' },
    ];
    this.form2responsiveSteps = [
      { columns: 1 },
      { minWidth: '180px', columns: 2 },
    ];
    this.form4responsiveSteps = [{ columns: 1, labelsPosition: 'top' }];
  }

  /**
   * Manipula a tecla pressionada no campo de comentário.
   * Se a tecla "Enter" for pressionada, o campo é desfocado e o botão "Send" é acionado.
   *
   * @param {KeyboardEvent} event - Evento de teclado.
   * @private
   */
  _onCommentKeydown(event) {
    if (event.key === 'Enter' || event.keyCode == 13) {
      this.shadowRoot.querySelector('#commentField').blur();
      this.shadowRoot.querySelector('#sendComment').click();
    }
  }
}

customElements.define(OrderDetails.is, OrderDetails);

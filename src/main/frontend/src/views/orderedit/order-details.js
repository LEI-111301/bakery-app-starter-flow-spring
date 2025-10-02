/**
 * `order-details` é um Web Component baseado em LitElement que exibe
 * todos os detalhes de uma encomenda.
 *
 * Funcionalidades:
 * - Exibe status da encomenda com `<order-status-badge>`.
 * - Mostra informações do cliente (nome, telefone e detalhes adicionais).
 * - Lista produtos da encomenda com quantidade, preço e comentários.
 * - Exibe histórico de mudanças da encomenda.
 * - Permite adicionar comentários via campo de texto.
 * - Inclui barra de botões (`buttons-bar`) com ações (Cancelar, Editar, Salvar/Place Order) e total.
 * - Suporta sombras automáticas no scroll através de `ScrollShadowMixin`.
 *
 * @element order-details
 * @mixes ScrollShadowMixin
 */
class OrderDetails extends ScrollShadowMixin(LitElement) {
    /**
     * Estilos CSS do componente.
     */
    static get styles() {
        return [
            sharedStyles,
            css`
        :host { display: flex; flex-direction: column; box-sizing: border-box; flex: auto; }
        .table { display: table; }
        .tr { display: table-row; }
        .td { display: table-cell; }
        .main-row { flex: 1; }
        h3 { margin: 0; word-break: break-word; white-space: normal; }
        .date, .time { white-space: nowrap; }
        .dim, .secondary { color: var(--lumo-secondary-text-color); }
        .secondary { font-size: var(--lumo-font-size-xs); line-height: var(--lumo-font-size-xl); }
        .meta-row { display: flex; justify-content: space-between; padding-bottom: var(--lumo-space-s); }
        .products { width: 100%; }
        .products .td { text-align: center; vertical-align: middle; padding: var(--lumo-space-xs); border-bottom: 1px solid var(--lumo-contrast-10pct); }
        .products .td.product-name { text-align: left; padding-left: 0; width: 100%; }
        .products .td.number { text-align: right; }
        .products .td.money { text-align: right; padding-right: 0; }
        .history-line { margin: var(--lumo-space-xs) 0; }
        .comment { font-size: var(--lumo-font-size-s); }
        order-status-badge[small] { margin-left: 0.5em; }
        #sendComment { color: var(--lumo-primary-color-50pct); }

        @media (min-width: 600px) { .main-row { padding: var(--lumo-space-l); flex-basis: auto; } }
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
      <div class="scrollable main-row" id="main">
        <!-- Meta info -->
        <div class="meta-row">
          <order-status-badge .status="${this.item && this.item.state}"></order-status-badge>
          <span class="dim">Order #${this.item && this.item.id}</span>
        </div>

        <!-- Formulários responsivos -->
        <vaadin-form-layout id="form1" .responsiveSteps="${this.form1responsiveSteps}">
          <vaadin-form-item>
            <label slot="label">Due</label>
            <vaadin-form-layout id="form2" .responsiveSteps="${this.form2responsiveSteps}">
              <div class="date">
                <h3>${this.item && this.item.formattedDueDate.day}</h3>
                <span class="dim">${this.item && this.item.formattedDueDate.weekday}</span>
              </div>
              <div class="time">
                <h3>${this.item && this.item.formattedDueTime}</h3>
                <span class="dim">${this.item && this.item.pickupLocation.name}</span>
              </div>
            </vaadin-form-layout>
          </vaadin-form-item>

          <vaadin-form-item colspan="2">
            <label slot="label">Customer</label>
            <h3>${this.item && this.item.customer.fullName}</h3>
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Phone number</label>
            <h3>${this.item && this.item.customer.phoneNumber}</h3>
          </vaadin-form-item>
        </vaadin-form-layout>

        <!-- Produtos, histórico e comentários -->
        <vaadin-form-layout id="form3" .responsiveSteps="${this.form3responsiveSteps}">
          <div></div>
          <vaadin-form-layout id="form4" colspan="2" .responsiveSteps="${this.form4responsiveSteps}">
            ${when(this.item && this.item.customer.details, () => html`
              <vaadin-form-item label-position="top">
                <label slot="label">Additional details</label>
                <span>${this.item.customer.details}</span>
              </vaadin-form-item>`)}

            <vaadin-form-item>
              <label slot="label">Products</label>
              <div class="table products">
                ${this.item && map(this.item.items, item => item.product.name && html`
                  <div class="tr">
                    <div class="td product-name">
                      <div class="bold">${item.product.name}</div>
                      <div class="secondary">${item.comment}</div>
                    </div>
                    <div class="td number"><span class="count">${item.quantity}</span></div>
                    <div class="td dim">×</div>
                    <div class="td money">${item.product.formattedPrice}</div>
                  </div>`)}
              </div>
            </vaadin-form-item>

            <vaadin-form-item id="history" .labelPosition="top" .hidden="${this.review}">
              <label slot="label">History</label>
              ${this.item && map(this.item.history, event => html`
                <div class="history-line">
                  <span class="bold">${event.createdBy.firstName}</span>
                  <span class="secondary">${event.formattedTimestamp}</span>
                  <order-status-badge .status="${event.newState}" small></order-status-badge>
                </div>
                <div class="comment">${event.message}</div>
              `)}
            </vaadin-form-item>

            <vaadin-form-item id="comment" .hidden="${this.review}">
              <vaadin-text-field
                id="commentField"
                placeholder="Add comment"
                class="full-width"
                @keydown="${this._onCommentKeydown}"
                maxlength="255"
              >
                <div slot="suffix" class="comment-suffix">
                  <vaadin-button id="sendComment" theme="tertiary">Send</vaadin-button>
                </div>
              </vaadin-text-field>
            </vaadin-form-item>
          </vaadin-form-layout>
        </vaadin-form-layout>
      </div>

      <!-- Barra de botões -->
      <buttons-bar id="footer" no-scroll="${this.noScroll}">
        <vaadin-button slot="left" id="back" .hidden="${!this.review}">Back</vaadin-button>
        <vaadin-button slot="left" id="cancel" .hidden="${this.review}">Cancel</vaadin-button>
        <div slot="info" class="total">Total ${this.item && this.item.formattedTotalPrice}</div>
        <vaadin-button slot="right" id="save" theme="primary success" .hidden="${!this.review}">
          <vaadin-icon icon="vaadin:check" slot="suffix"></vaadin-icon>Place order
        </vaadin-button>
        <vaadin-button slot="right" id="edit" theme="primary" .hidden="${this.review}">
          Edit order
          <vaadin-icon icon="vaadin:edit" slot="suffix"></vaadin-icon>
        </vaadin-button>
      </buttons-bar>
    `;
    }

    /** Nome da tag do elemento */
    static get is() { return 'order-details'; }

    /** Propriedades reativas */
    static get properties() {
        return {
            /** Dados da encomenda */
            item: { type: Object },
            /** Modo de revisão (review) */
            review: { type: Boolean },
            /** Passos responsivos para formulários */
            form1responsiveSteps: { type: Array },
            form2responsiveSteps: { type: Array },
            form3responsiveSteps: { type: Array },
            form4responsiveSteps: { type: Array },
        };
    }

    constructor() {
        super();
        this.form1responsiveSteps = this.form3responsiveSteps = [
            { columns: 1, labelsPosition: 'top' },
            { minWidth: '600px', columns: 4, labelsPosition: 'top' },
        ];
        this.form2responsiveSteps = [{ columns: 1 }, { minWidth: '180px', columns: 2 }];
        this.form4responsiveSteps = [{ columns: 1, labelsPosition: 'top' }];
    }

    /**
     * Evento de tecla no campo de comentário.
     * Pressionar Enter dispara o botão "Send".
     * @param {KeyboardEvent} event
     */
    _onCommentKeydown(event) {
        if (event.key === 'Enter' || event.keyCode == 13) {
            this.shadowRoot.querySelector('#commentField').blur();
            this.shadowRoot.querySelector('#sendComment').click();
        }
    }
}

customElements.define(OrderDetails.is, OrderDetails);

/**
 * `order-status-badge` é um componente que exibe o status de um pedido com cores e ícones correspondentes.
 *
 * Funcionalidades:
 * - Diferentes estilos para status: `ready`, `new`, `problem`, `delivered`.
 * - Suporte para versão pequena (`small`).
 * - Exibe ícone de check para status `delivered`.
 *
 * @element order-status-badge
 *
 * @attr {String} status - Status do pedido (ex: 'new', 'ready', 'problem', 'delivered'). O atributo é refletido como minúsculo.
 * @attr {Boolean} small - Define uma versão menor do badge.
 *
 * @csspart wrapper - Container principal do badge.
 *
 * @example
 * <order-status-badge status="ready"></order-status-badge>
 * <order-status-badge status="delivered" small></order-status-badge>
 */
class OrderStatusBadge extends LitElement {
    static get styles() {
        return css`
            #wrapper {
                display: inline-block;
                border-radius: var(--lumo-border-radius);
                background: var(--lumo-shade-10pct);
                color: var(--lumo-secondary-text-color);
                padding: 2px 10px;
                font-size: var(--lumo-font-size-xs);
                text-transform: capitalize;
            }

            :host([status='ready']) #wrapper {
                color: var(--lumo-success-color);
                background: var(--lumo-success-color-10pct);
            }

            :host([status='new']) #wrapper {
                color: var(--lumo-primary-color);
                background: var(--lumo-primary-color-10pct);
            }

            :host([status='problem']) #wrapper {
                color: var(--lumo-error-color);
                background: var(--lumo-error-color-10pct);
            }

            :host([status='delivered']) #wrapper {
                padding: 2px 8px;
            }

            :host([status='delivered']) #wrapper span,
            :host(:not([status='delivered'])) #wrapper vaadin-icon {
                display: none;
            }

            :host([small]) #wrapper {
                padding: 0 5px;
            }

            vaadin-icon {
                width: 12px;
            }

            :host([small]) vaadin-icon {
                width: 8px;
            }
        `;
    }

    render() {
        return html`
            <div id="wrapper">
                <span>${this.__toLowerCase(this.status)}</span>
                <vaadin-icon icon="vaadin:check"></vaadin-icon>
            </div>
        `;
    }

    static get is() {
        return 'order-status-badge';
    }

    static get properties() {
        return {
            /**
             * Status do pedido.
             * Refletido como atributo minúsculo no DOM.
             */
            status: {
                type: String,
                reflect: true,
                converter: {
                    fromAttribute: (value) => value.toUpperCase(),
                    toAttribute: (value) => value.toLowerCase(),
                },
            },
            /**
             * Indica se o badge deve ser renderizado em versão pequena.
             */
            small: { type: Boolean, reflect: true },
        };
    }

    __toLowerCase(status) {
        return status ? status.toLowerCase() : '';
    }
}

customElements.define(OrderStatusBadge.is, OrderStatusBadge);

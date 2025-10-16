/**
 * @module OrderStatusBadge
 * @description
 * Componente web responsável por exibir um **selo visual de status (badge)** de um pedido.
 *
 * O `<order-status-badge>` é usado em conjunto com componentes como `<order-card>` para indicar,
 * de forma visual e textual, o estado atual de um pedido no sistema.
 *
 * ---
 * ### Principais recursos:
 * - Suporte a diferentes **estados de pedido**: `new`, `ready`, `problem`, `delivered`.
 * - Mudança automática de **cor e ícone** conforme o estado.
 * - Modo **compacto (`small`)** para uso em layouts reduzidos.
 * - Reflete o atributo `status` no DOM e mantém coerência entre o valor interno e o atributo HTML.
 *
 * ---
 * @example
 * ```html
 * <!-- Status: novo pedido -->
 * <order-status-badge status="new"></order-status-badge>
 *
 * <!-- Status: pronto -->
 * <order-status-badge status="ready"></order-status-badge>
 *
 * <!-- Status: entregue -->
 * <order-status-badge status="delivered"></order-status-badge>
 *
 * <!-- Versão compacta -->
 * <order-status-badge status="ready" small></order-status-badge>
 * ```
 *
 * ---
 * @extends {LitElement}
 */
import { html, css, LitElement } from 'lit';
import '@vaadin/icon';
import '@vaadin/icons';

class OrderStatusBadge extends LitElement {
  /**
   * Define os estilos do componente.
   *
   * As regras de estilo alteram cor, fundo e espaçamento com base no valor do atributo `status`.
   * O badge é visualmente consistente com o tema **Vaadin Lumo**.
   *
   * @returns {CSSResult}
   */
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

  /**
   * Renderiza o conteúdo visual do componente.
   *
   * Quando o status é diferente de `delivered`, o texto do status é exibido (em minúsculas).
   * Quando o status é `delivered`, o texto é ocultado e apenas o ícone de check (`vaadin:check`) é mostrado.
   *
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <div id="wrapper">
        <span>${this.__toLowerCase(this.status)}</span>
        <vaadin-icon icon="vaadin:check"></vaadin-icon>
      </div>
    `;
  }

  /**
   * Identificador do custom element.
   * @readonly
   * @returns {string}
   */
  static get is() {
    return 'order-status-badge';
  }

  /**
   * Define as propriedades reativas do componente.
   * Inclui o atributo `status`, que controla a aparência do badge.
   *
   * @returns {Object}
   */
  static get properties() {
    return {
      /**
       * Define o **status atual do pedido**.
       * Controla o texto e a aparência visual do badge.
       *
       * Valores suportados:
       * - `"new"` → Pedido novo;
       * - `"ready"` → Pedido pronto;
       * - `"problem"` → Pedido com problema;
       * - `"delivered"` → Pedido entregue (mostra apenas o ícone ✔️).
       *
       * O valor é refletido no atributo HTML e convertido automaticamente
       * para **maiúsculas internamente** e **minúsculas externamente**.
       *
       * @type {string}
       * @attribute
       * @reflect
       */
      status: {
        type: String,
        reflect: true,
        converter: {
          fromAttribute: (value) => value.toUpperCase(),
          toAttribute: (value) => value.toLowerCase()
        }
      }
    };
  }

  /**
   * Converte o status para letras minúsculas, garantindo exibição uniforme no template.
   *
   * @private
   * @param {string} status - Valor atual do status.
   * @returns {string} O valor convertido em minúsculas.
   */
  __toLowerCase(status) {
    return status ? status.toLowerCase() : '';
  }
}

customElements.define(OrderStatusBadge.is, OrderStatusBadge);

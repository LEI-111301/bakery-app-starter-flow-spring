/**
 * @module OrderCard
 * @description
 * Componente web responsável por **exibir informações resumidas de um pedido (order)** em formato de **cartão interativo**.
 *
 * O `<order-card>` é utilizado principalmente na listagem de pedidos (como em painéis de loja ou dashboards)
 * e exibe informações essenciais do pedido, incluindo:
 * - Estado (status) com o componente `<order-status-badge>`;
 * - Data e horário do pedido;
 * - Nome do cliente;
 * - Itens do pedido (produtos e quantidades);
 * - Local de retirada (pickup).
 *
 * ---
 * ### Principais recursos:
 * - Layout totalmente **responsivo** (ajuste automático para mobile e desktop);
 * - Integração direta com o componente `<order-status-badge>`;
 * - Renderização dinâmica da lista de produtos com a diretiva `map`;
 * - Emite evento personalizado `card-click` ao ser clicado.
 *
 * ---
 * @example
 * ```html
 * <order-card
 *   .orderCard="${{
 *     fullName: 'Alice Santos',
 *     time: '14:30',
 *     shortDay: 'Tue',
 *     month: 'Oct',
 *     state: 'ready',
 *     items: [
 *       { quantity: 2, product: { name: 'Latte' } },
 *       { quantity: 1, product: { name: 'Croissant' } },
 *     ]
 *   }}"
 *   .header="${{ main: 'Today', secondary: 'Tuesday, 8 Oct' }}"
 * ></order-card>
 * ```
 *
 * ---
 * @extends {LitElement}
 * @fires {CustomEvent} card-click - Disparado quando o cartão é clicado.
 */
import { html, css, LitElement } from 'lit';
import { map } from 'lit/directives/map.js';
import './order-status-badge.js';
import { sharedStyles } from '../../../styles/shared-styles.js';

class OrderCard extends LitElement {
  /**
   * Define os estilos CSS do componente.
   * Inclui ajustes de layout, espaçamento e responsividade.
   *
   * @returns {CSSResultGroup}
   */
  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: block;
        }

        .content {
          display: block;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }

        .wrapper {
          background: var(--lumo-base-color);
          background-image: linear-gradient(
            var(--lumo-tint-5pct),
            var(--lumo-tint-5pct)
          );
          box-shadow: 0 3px 5px var(--lumo-shade-10pct);
          border-bottom: 1px solid var(--lumo-shade-10pct);
          display: flex;
          padding: var(--lumo-space-l) var(--lumo-space-m);
          cursor: pointer;
        }

        .main {
          color: var(--lumo-secondary-text-color);
          margin-right: var(--lumo-space-s);
          font-weight: bold;
        }

        .group-heading {
          margin: var(--lumo-space-l) var(--lumo-space-m) var(--lumo-space-s);
        }

        .secondary {
          color: var(--lumo-secondary-text-color);
        }

        .info-wrapper {
          display: flex;
          flex-direction: column-reverse;
          justify-content: flex-end;
        }

        .badge {
          margin: var(--lumo-space-s) 0;
          width: 100px;
        }

        .time-place {
          width: 120px;
        }

        .name-items {
          flex: 1;
        }

        .place,
        .secondary-time,
        .full-day,
        .goods {
          color: var(--lumo-secondary-text-color);
        }

        .time,
        .name,
        .short-day,
        .month {
          margin: 0;
        }

        .name {
          word-break: break-all;
          word-break: break-word;
          white-space: normal;
        }

        .goods {
          display: flex;
          flex-wrap: wrap;
        }

        .goods > div {
          box-sizing: border-box;
          width: 18em;
          flex: auto;
          padding-right: var(--lumo-space-l);
        }

        .goods-item {
          display: flex;
          align-items: baseline;
          font-size: var(--lumo-font-size-s);
          margin: var(--lumo-space-xs) 0;
        }

        .goods-item > .count {
          margin-right: var(--lumo-space-s);
          white-space: nowrap;
        }

        .goods-item > div {
          flex: auto;
          word-break: break-all;
          word-break: break-word;
          white-space: normal;
        }

        @media (min-width: 600px) {
          .info-wrapper {
            flex-direction: row;
          }

          .wrapper {
            border-radius: var(--lumo-border-radius);
          }

          .badge {
            margin: 0;
          }

          .content {
            max-width: 964px;
          }
        }
      `,
    ];
  }

  /**
   * Renderiza o cartão de pedido.
   *
   * Estrutura:
   * - Cabeçalho do grupo (`header.main` e `header.secondary`);
   * - Corpo principal com:
   *   - Badge de status (`<order-status-badge>`);
   *   - Horário, data e local de entrega;
   *   - Nome do cliente;
   *   - Lista de itens do pedido.
   *
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <div class="content">
        <!-- Cabeçalho de grupo -->
        <div class="group-heading" ?hidden="${!this.header}">
          <span class="main">${this.header && this.header.main}</span>
          <span class="secondary">${this.header && this.header.secondary}</span>
        </div>

        <!-- Cartão principal -->
        <div class="wrapper" @click="${this._cardClick}">
          <div class="info-wrapper">
            <!-- Estado do pedido -->
            <order-status-badge
              class="badge"
              .status="${this.orderCard && this.orderCard.state}"
            ></order-status-badge>

            <!-- Informações de horário e local -->
            <div class="time-place">
              <h3 class="time">${this.orderCard?.time ?? ''}</h3>
              <h3 class="short-day">${this.orderCard?.shortDay ?? ''}</h3>
              <h3 class="month">${this.orderCard?.month ?? ''}</h3>
              <div class="secondary-time">
                ${this.orderCard?.secondaryTime ?? ''}
              </div>
              <div class="full-day">${this.orderCard?.fullDay ?? ''}</div>
              <div class="place">${this.orderCard?.place ?? ''}</div>
            </div>
          </div>

          <!-- Nome e lista de produtos -->
          <div class="name-items">
            <h3 class="name">${this.orderCard?.fullName ?? ''}</h3>

            <div class="goods">
              ${map(this.orderCard?.items ?? [], (item) => html`
                <div class="goods-item">
                  <span class="count">${item.quantity}</span>
                  <div>${item.product.name}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Define as propriedades reativas do componente.
   * @returns {Object}
   */
  static get properties() {
    return {
      /**
       * Objeto contendo os dados principais do pedido a ser exibido no cartão.
       * @type {Object}
       * @property {string} fullName - Nome completo do cliente.
       * @property {string} state - Estado atual do pedido.
       * @property {string} time - Hora do pedido.
       * @property {string} shortDay - Dia abreviado.
       * @property {string} month - Mês abreviado.
       * @property {string} place - Local de entrega ou retirada.
       * @property {Array<{ quantity: number, product: { name: string } }>} items - Itens do pedido.
       */
      orderCard: { type: Object },

      /**
       * Cabeçalho do grupo ao qual o pedido pertence (ex: "Today", "Tomorrow").
       * @type {{ main: string, secondary: string }}
       */
      header: { type: Object },

      /**
       * Item auxiliar usado em algumas instâncias herdadas.
       * @type {Object}
       */
      item: { type: Object },
    };
  }

  /**
   * Identificador do custom element.
   * @readonly
   * @returns {string}
   */
  static get is() {
    return 'order-card';
  }

  /**
   * Manipulador do clique no cartão.
   * Emite o evento `card-click` para permitir que o componente pai reaja
   * (ex: abrir detalhes do pedido).
   *
   * @fires {CustomEvent} card-click
   */
  _cardClick() {
    this.dispatchEvent(new CustomEvent('card-click'));
  }
}

customElements.define(OrderCard.is, OrderCard);

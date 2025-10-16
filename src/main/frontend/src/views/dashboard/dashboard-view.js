/**
 * @module DashboardView
 * @description
 * Componente principal do dashboard, responsável por compor e exibir
 * os principais indicadores, gráficos e tabelas num layout responsivo.
 *
 * Este componente usa **Vaadin Board** para o layout e organiza:
 * - Contadores superiores (`<dashboard-counter-label>`)
 * - Gráficos de colunas e de donut (`<vaadin-chart>`)
 * - Tabela de pedidos (`<vaadin-grid>`)
 *
 * Inclui um *hook* (`firstUpdated`) que mede o tempo de carregamento da página
 * com base na renderização completa dos gráficos e da grelha (grid).
 *
 * @example
 * ```html
 * <dashboard-view></dashboard-view>
 * ```
 *
 * @extends {LitElement}
 * @fires performance-mark - (indireto) Marca o ponto `bakery-page-loaded` quando todos os componentes carregam.
 */

import { html, css, LitElement } from 'lit';
import '@vaadin/board';
import '@vaadin/board/vaadin-board-row.js';
import '@vaadin/charts';
import '@vaadin/grid';
import '../storefront/order-card.js';
import './dashboard-counter-label.js';
import { sharedStyles } from '../../../styles/shared-styles.js';

class DashboardView extends LitElement {
  /**
   * Define os estilos CSS do componente, incluindo o layout do Vaadin Board,
   * ajustes de espaçamento e dimensões dos gráficos.
   *
   * Usa também `sharedStyles` importados para manter consistência visual com o resto da aplicação.
   *
   * @returns {CSSResult[]}
   */
  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          width: 100%;
          -webkit-overflow-scrolling: touch;
          overflow: auto;
        }

        .vaadin-board-cell {
          padding: var(--lumo-space-s);
        }

        *::-ms-backdrop,
        .vaadin-board-cell {
          padding: 0;
        }

        .column-chart {
          box-shadow: 0 2px 5px 0 rgba(23, 68, 128, 0.1);
          border-radius: 4px;
          height: calc(20vh - 64px) !important;
          min-height: 150px;
        }

        #yearlySalesGraph {
          height: calc(30vh - 64px) !important;
          min-height: 200px;
        }

        #monthlyProductSplit,
        #ordersGrid {
          border-radius: 4px;
          box-shadow: 0 2px 5px 0 rgba(23, 68, 128, 0.1);
          height: calc(40vh - 64px) !important;
          min-height: 355px;
        }

        vaadin-board-row.custom-board-row {
          --vaadin-board-width-medium: 1440px;
          --vaadin-board-width-small: 1024px;
        }
      `,
    ];
  }

  /**
   * Renderiza o layout completo do dashboard.
   *
   * Estrutura principal:
   * 1. **Primeira linha:** Quatro `dashboard-counter-label` (com gráficos de contagem e cores distintas)
   * 2. **Segunda linha:** Dois gráficos de colunas (`deliveriesThisMonth`, `deliveriesThisYear`)
   * 3. **Terceira linha:** Gráfico anual de vendas (`yearlySalesGraph`)
   * 4. **Quarta linha:** Gráfico de produto mensal e grelha de pedidos (`monthlyProductSplit`, `ordersGrid`)
   *
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <vaadin-board>
        <!-- Linha 1: Contadores -->
        <vaadin-board-row>
          <dashboard-counter-label id="todayCount" class="green">
            <vaadin-chart
              id="todayCountChart"
              class="counter"
              theme="classic"
            ></vaadin-chart>
          </dashboard-counter-label>
          <dashboard-counter-label
            id="notAvailableCount"
            class="red"
          ></dashboard-counter-label>
          <dashboard-counter-label
            id="newCount"
            class="blue"
          ></dashboard-counter-label>
          <dashboard-counter-label
            id="tomorrowCount"
            class="gray"
          ></dashboard-counter-label>
        </vaadin-board-row>

        <!-- Linha 2: Gráficos de colunas -->
        <vaadin-board-row>
          <div class="vaadin-board-cell">
            <vaadin-chart
              id="deliveriesThisMonth"
              class="column-chart"
              theme="classic"
            ></vaadin-chart>
          </div>
          <div class="vaadin-board-cell">
            <vaadin-chart
              id="deliveriesThisYear"
              class="column-chart"
              theme="classic"
            ></vaadin-chart>
          </div>
        </vaadin-board-row>

        <!-- Linha 3: Gráfico de vendas anuais -->
        <vaadin-board-row>
          <vaadin-chart
            id="yearlySalesGraph"
            class="yearly-sales"
            theme="classic"
          ></vaadin-chart>
        </vaadin-board-row>

        <!-- Linha 4: Gráfico de produtos e grelha -->
        <vaadin-board-row class="custom-board-row">
          <div class="vaadin-board-cell">
            <vaadin-chart
              id="monthlyProductSplit"
              class="product-split-donut"
              theme="classic"
            ></vaadin-chart>
          </div>
          <div class="vaadin-board-cell">
            <vaadin-grid id="ordersGrid" theme="orders dashboard"></vaadin-grid>
          </div>
        </vaadin-board-row>
      </vaadin-board>
    `;
  }

  /**
   * Nome do custom element para registro.
   * @readonly
   * @returns {string}
   */
  static get is() {
    return 'dashboard-view';
  }

  /**
   * Lifecycle: chamado após a primeira renderização.
   *
   * Este método mede o tempo de carregamento da página:
   * - Cria uma `Promise` que é resolvida quando todos os gráficos terminam de carregar.
   * - Cria outra `Promise` que é resolvida quando a grelha (`#ordersGrid`) deixa de estar em estado `loading`.
   * - Quando ambas são resolvidas, marca o evento de performance `"bakery-page-loaded"`.
   *
   * Pode ser removido em produção se não for necessária medição de performance.
   *
   * @override
   */
  firstUpdated() {
    super.firstUpdated();

    /**
     * Promise resolvida quando todos os gráficos terminam de carregar.
     * @type {Promise<void>}
     * @private
     */
    this._chartsLoaded = new Promise((resolve) => {
      this._chartsLoadedResolve = () => {
        resolve();
      };
    });

    /**
     * Promise resolvida quando a grelha (`ordersGrid`) termina o carregamento.
     * @type {Promise<void>}
     * @private
     */
    this._gridLoaded = new Promise((resolve) => {
      const ordersGrid = this.shadowRoot.querySelector('#ordersGrid');
      const listener = () => {
        if (!ordersGrid.loading) {
          ordersGrid.removeEventListener('loading-changed', listener);
          resolve();
        }
      };
      ordersGrid.addEventListener('loading-changed', listener);
    });

    // Marca o momento em que todos os componentes estão totalmente carregados
    Promise.all([this._chartsLoaded, this._gridLoaded]).then(() => {
      if (window.performance.mark) {
        window.performance.mark('bakery-page-loaded');
      }
    });
  }
}

customElements.define(DashboardView.is, DashboardView);

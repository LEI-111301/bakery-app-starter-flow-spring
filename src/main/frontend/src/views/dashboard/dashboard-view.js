import { html, css, LitElement } from 'lit';
import '@vaadin/board';
import '@vaadin/board/vaadin-board-row.js';
import '@vaadin/charts';
import '@vaadin/grid';
import '../storefront/order-card.js';
import './dashboard-counter-label.js';
import { sharedStyles } from '../../../styles/shared-styles.js';

/**
 * `dashboard-view` é o componente principal da vista de Dashboard.
 *
 * Este Web Component organiza vários indicadores, gráficos e uma grelha de encomendas
 * num layout responsivo baseado em `vaadin-board`.
 *
 * ### Estrutura do Dashboard:
 * - **Linha 1:** Quatro indicadores principais (`dashboard-counter-label`) para métricas chave,
 *   com suporte a gráficos embutidos (slots).
 * - **Linha 2:** Dois gráficos de colunas (`vaadin-chart`) para entregas do mês e do ano.
 * - **Linha 3:** Gráfico de vendas anuais (`vaadin-chart`).
 * - **Linha 4:** Gráfico de repartição de produtos (`vaadin-chart`) + Grelha de encomendas (`vaadin-grid`).
 *
 * ### Funcionalidades:
 * - Layout totalmente responsivo com `vaadin-board`.
 * - Integração com Vaadin Charts (`vaadin-chart`) e Vaadin Grid (`vaadin-grid`).
 * - Suporte a KPIs através de `dashboard-counter-label`.
 * - Mede automaticamente o **tempo de carregamento da página** com `Performance.mark`.
 *
 * ### Exemplo de utilização:
 * ```html
 * <dashboard-view></dashboard-view>
 * ```
 *
 * @element dashboard-view
 *
 * @csspart board - Layout principal baseado em Vaadin Board.
 * @csspart chart - Gráficos internos.
 * @csspart grid - Grelha de encomendas.
 *
 * @cssprop --lumo-space-s - Espaçamento interno das células do board.
 */
class DashboardView extends LitElement {
    /**
     * Estilos CSS aplicados ao Dashboard.
     *
     * - Define o layout do board e paddings entre células.
     * - Aplica sombras e bordas arredondadas a gráficos e grelhas.
     * - Usa `sharedStyles` para consistência visual com a aplicação.
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
     * Renderiza a estrutura HTML do dashboard com
     * KPIs, gráficos e grelha de encomendas.
     *
     * @returns {import('lit').TemplateResult} Estrutura do dashboard.
     */
    render() {
        return html`
            <vaadin-board>
                <!-- Linha 1: Indicadores principais -->
                <vaadin-board-row>
                    <dashboard-counter-label id="todayCount" class="green">
                        <vaadin-chart
                                id="todayCountChart"
                                class="counter"
                                theme="classic"
                        ></vaadin-chart>
                    </dashboard-counter-label>
                    <dashboard-counter-label id="notAvailableCount" class="red"></dashboard-counter-label>
                    <dashboard-counter-label id="newCount" class="blue"></dashboard-counter-label>
                    <dashboard-counter-label id="tomorrowCount" class="gray"></dashboard-counter-label>
                </vaadin-board-row>

                <!-- Linha 2: Gráficos de entregas -->
                <vaadin-board-row>
                    <div class="vaadin-board-cell">
                        <vaadin-chart id="deliveriesThisMonth" class="column-chart" theme="classic"></vaadin-chart>
                    </div>
                    <div class="vaadin-board-cell">
                        <vaadin-chart id="deliveriesThisYear" class="column-chart" theme="classic"></vaadin-chart>
                    </div>
                </vaadin-board-row>

                <!-- Linha 3: Vendas anuais -->
                <vaadin-board-row>
                    <vaadin-chart id="yearlySalesGraph" class="yearly-sales" theme="classic"></vaadin-chart>
                </vaadin-board-row>

                <!-- Linha 4: Split de produtos + grelha de encomendas -->
                <vaadin-board-row class="custom-board-row">
                    <div class="vaadin-board-cell">
                        <vaadin-chart id="monthlyProductSplit" class="product-split-donut" theme="classic"></vaadin-chart>
                    </div>
                    <div class="vaadin-board-cell">
                        <vaadin-grid id="ordersGrid" theme="orders dashboard"></vaadin-grid>
                    </div>
                </vaadin-board-row>
            </vaadin-board>
        `;
    }

    /**
     * Identificador da tag custom element.
     *
     * @returns {string} Nome do componente (`dashboard-view`).
     */
    static get is() {
        return 'dashboard-view';
    }

    /**
     * Ciclo de vida: chamado após a primeira renderização.
     *
     * - Cria *Promises* para sincronizar o carregamento dos gráficos e da grelha.
     * - Marca o evento de carregamento (`bakery-page-loaded`) usando Performance API.
     *
     * @override
     */
    firstUpdated() {
        super.firstUpdated();
        this._chartsLoaded = new Promise((resolve, reject) => {
            // Guardamos a função resolve para ser chamada quando os gráficos terminarem de carregar.
            this._chartsLoadedResolve = () => {
                resolve();
            };
        });

        this._gridLoaded = new Promise((resolve, reject) => {
            const ordersGrid = this.shadowRoot.querySelector('#ordersGrid');
            const listener = () => {
                if (!ordersGrid.loading) {
                    ordersGrid.removeEventListener('loading-changed', listener);
                    resolve();
                }
            };
            ordersGrid.addEventListener('loading-changed', listener);
        });

        // Quando gráficos e grelha terminam, marcamos o carregamento completo da página
        Promise.all([this._chartsLoaded, this._gridLoaded]).then(() => {
            window.performance.mark && window.performance.mark('bakery-page-loaded');
        });
    }
}

customElements.define(DashboardView.is, DashboardView);

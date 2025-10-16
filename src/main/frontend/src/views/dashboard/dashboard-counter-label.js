/**
 * @module DashboardCounterLabel
 * @description
 * Componente Web (`LitElement`) que representa um rótulo de contador (counter label)
 * utilizado em dashboards.
 *
 * O componente exibe:
 *  - Um **valor numérico principal** (count-digit);
 *  - Um **título**;
 *  - Um **subtítulo**;
 *  - Um **gráfico ou conteúdo adicional** inserido via `<slot>`.
 *
 * É altamente personalizável através de classes (`.green`, `.red`, `.blue`, `.gray`)
 * que alteram a cor do contador principal.
 *
 * @example
 * ```html
 * <dashboard-counter-label class="green">
 *   <my-chart slot></my-chart>
 * </dashboard-counter-label>
 * ```
 *
 * ```js
 * const counter = document.querySelector('dashboard-counter-label');
 * counter.shadowRoot.getElementById('count').textContent = '125';
 * counter.shadowRoot.getElementById('title').textContent = 'Vendas';
 * counter.shadowRoot.getElementById('subtitle').textContent = 'Hoje';
 * ```
 *
 * @extends {LitElement}
 */
import { html, css, LitElement } from 'lit';

class DashboardCounterLabel extends LitElement {
  /**
   * Define os estilos CSS aplicados ao componente.
   *
   * @returns {CSSResult}
   */
  static get styles() {
    return css`
      :host {
        position: relative;
        text-align: center;
        height: calc(18vh - 64px);
        min-height: 180px;
        display: block;
      }

      /* === Temas de cor === */
      :host(.green) .count-digit {
        color: #55bf3b;
      }

      :host(.red) .count-digit {
        color: #ff473a;
      }

      :host(.blue) .count-digit {
        color: #1877f3;
      }

      :host(.gray) .count-digit {
        color: rgba(45, 71, 105, 0.7);
      }

      /* === Layout === */
      .content {
        padding: 10px;
      }

      .count-wrapper {
        display: block;
        text-align: center;
        padding-top: 12px;
        margin-bottom: 18px;
      }

      .count-digit {
        font-size: 44px;
      }

      .subtitle {
        color: var(--lumo-secondary-text-color);
        font-size: 14px;
      }

      h4 {
        margin: 0;
      }

      .chart-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        height: 120px;
        width: 100%;
      }
    `;
  }

  /**
   * Renderiza o template HTML do componente.
   *
   * Estrutura:
   * - Um contêiner superior `.chart-wrapper` que contém um `<slot>` para gráficos.
   * - Um bloco `.content` que exibe:
   *   - O número principal (`#count`)
   *   - O título (`#title`)
   *   - O subtítulo (`#subtitle`)
   *
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <div class="chart-wrapper">
        <slot></slot>
      </div>

      <div class="content">
        <div class="count-wrapper">
          <span id="count" class="count-digit"></span>
        </div>

        <h4 id="title"></h4>
        <div id="subtitle" class="subtitle"></div>
      </div>
    `;
  }

  /**
   * Identificador estático do componente custom element.
   * @readonly
   * @returns {string}
   */
  static get is() {
    return 'dashboard-counter-label';
  }
}

customElements.define(DashboardCounterLabel.is, DashboardCounterLabel);

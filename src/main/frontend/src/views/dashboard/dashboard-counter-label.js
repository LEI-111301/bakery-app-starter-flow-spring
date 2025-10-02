import { html, css, LitElement } from 'lit';

/**
 * `dashboard-counter-label` é um Web Component baseado em LitElement
 * utilizado para exibir um contador com título, subtítulo e espaço para gráficos.
 *
 * É ideal para dashboards e interfaces analíticas, permitindo mostrar
 * indicadores chave de performance (KPIs), métricas ou estatísticas
 * numéricas com suporte a cores e visualizações adicionais.
 *
 * ### Estrutura do componente:
 * - **Chart Wrapper (`slot`)**: área reservada para gráficos ou elementos adicionais
 *   (ocupando a parte superior do cartão).
 * - **Count Digit (`#count`)**: número em destaque, estilizado conforme a cor aplicada.
 * - **Title (`#title`)**: título ou nome do indicador.
 * - **Subtitle (`#subtitle`)**: texto complementar ou detalhe adicional.
 *
 * ### Personalização de cor:
 * A cor do número principal (`.count-digit`) é definida via classes no host:
 * - `.green` → Verde (#55bf3b)
 * - `.red` → Vermelho (#ff473a)
 * - `.blue` → Azul (#1877f3)
 * - `.gray` → Cinzento translúcido (rgba(45,71,105,0.7))
 *
 * @element dashboard-counter-label
 *
 * @slot - Espaço no topo (slot padrão) para gráficos, ícones ou componentes extra.
 *
 * @csspart count-digit - Estilização do número principal.
 * @csspart title - Estilização do título.
 * @csspart subtitle - Estilização do subtítulo.
 *
 * @cssprop --lumo-secondary-text-color - Cor aplicada ao subtítulo.
 *
 * ### Exemplo de utilização:
 * ```html
 * <dashboard-counter-label class="green">
 *   <my-chart slot="chart"></my-chart>
 * </dashboard-counter-label>
 *
 * <script>
 *   const counter = document.querySelector('dashboard-counter-label');
 *   counter.shadowRoot.getElementById('count').textContent = "1500";
 *   counter.shadowRoot.getElementById('title').textContent = "Vendas";
 *   counter.shadowRoot.getElementById('subtitle').textContent = "No último mês";
 * </script>
 * ```
 */
class DashboardCounterLabel extends LitElement {
    /**
     * Estilos CSS aplicados ao componente.
     *
     * - Define layout centralizado e responsivo.
     * - Diferencia cores do contador conforme a classe do host.
     * - Reserva espaço para gráficos na parte superior.
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
     * Renderiza o template do componente.
     *
     * @returns {import('lit').TemplateResult} Estrutura HTML do componente.
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
     * Identificador da custom element tag.
     *
     * @returns {string} Nome da tag (`dashboard-counter-label`).
     */
    static get is() {
        return 'dashboard-counter-label';
    }
}

customElements.define(DashboardCounterLabel.is, DashboardCounterLabel);

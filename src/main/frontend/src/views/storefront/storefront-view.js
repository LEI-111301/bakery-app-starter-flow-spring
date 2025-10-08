/**
 * @module StorefrontView
 * @description
 * Componente principal da **área de listagem e gerenciamento de pedidos** da aplicação (Storefront).
 *
 * O `<storefront-view>` exibe uma lista de pedidos em formato de grade (`vaadin-grid`),
 * com suporte a busca e visualização detalhada por meio de um diálogo (`vaadin-dialog`).
 * É um dos componentes centrais da interface administrativa da aplicação.
 *
 * ---
 * ### Principais recursos:
 * - Barra de pesquisa com filtro (`<search-bar>`)
 * - Lista de pedidos (`<vaadin-grid>`)
 * - Visualização de detalhes via diálogo (`<vaadin-dialog>`)
 * - Integração com medições de desempenho da página (via `window.performance.mark`)
 *
 * ---
 * @example
 * ```html
 * <storefront-view></storefront-view>
 * ```
 *
 * ---
 * @extends {LitElement}
 */
import { html, css, LitElement } from 'lit';
import '@vaadin/grid';
import '@vaadin/dialog';
import '../../components/search-bar.js';
import './order-card.js';
import { sharedStyles } from '../../../styles/shared-styles.js';

class StorefrontView extends LitElement {
  /**
   * Define os estilos CSS do componente.
   * O layout é configurado como uma coluna flexível para acomodar a barra de busca,
   * a grade e o diálogo em sequência vertical.
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
          height: 100%;
        }
      `,
    ];
  }

  /**
   * Renderiza a estrutura principal do componente.
   *
   * O layout inclui:
   * - `<search-bar>` — componente customizado para busca e filtragem.
   * - `<vaadin-grid>` — grade Vaadin que lista os pedidos.
   * - `<vaadin-dialog>` — janela modal para exibir detalhes de pedidos.
   *
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <search-bar id="search" show-checkbox=""></search-bar>

      <vaadin-grid id="grid" theme="orders no-row-borders"></vaadin-grid>

      <vaadin-dialog id="dialog" theme="orders"></vaadin-dialog>
    `;
  }

  /**
   * Identificador do custom element.
   * @readonly
   * @returns {string}
   */
  static get is() {
    return 'storefront-view';
  }

  /**
   * Método do ciclo de vida do LitElement chamado após o elemento ser inicializado no DOM.
   *
   * Aqui, é configurado um *listener* para medir o tempo de carregamento da página,
   * marcando o evento `'bakery-page-loaded'` quando o grid termina de carregar os dados.
   *
   * Este código pode ser removido com segurança caso não seja necessário o monitoramento de desempenho.
   *
   * @override
   */
  ready() {
    super.ready();

    // Código de medição de desempenho (opcional)
    const grid = this.$.grid;
    const listener = () => {
      if (!grid.loading && window.performance.mark) {
        window.performance.mark('bakery-page-loaded');
        grid.removeEventListener('loading-changed', listener);
      }
    };
    grid.addEventListener('loading-changed', listener);
  }
}

customElements.define(StorefrontView.is, StorefrontView);

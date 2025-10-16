/**
 * @module ScrollShadowMixin
 * @description
 * Mixin que adiciona a capacidade de aplicar o atributo `scroll-shadow` (ou `no-scroll`)
 * a um componente que contenha um elemento com o id `#main` no seu shadow DOM.
 *
 * A função do mixin é detectar automaticamente quando o conteúdo de `#main` ultrapassa
 * a altura visível (isto é, quando há overflow vertical) e ajustar o atributo `no-scroll`
 * de acordo — permitindo aplicar estilos dinâmicos (como sombras no topo/rodapé)
 * para indicar a existência de conteúdo oculto.
 *
 * @example
 * ```js
 * import { ScrollShadowMixin } from './scroll-shadow-mixin.js';
 * import { LitElement, html, css } from 'lit';
 *
 * class MyScrollablePanel extends ScrollShadowMixin(LitElement) {
 *   render() {
 *     return html`<div id="main">Conteúdo longo aqui...</div>`;
 *   }
 * }
 *
 * customElements.define('my-scrollable-panel', MyScrollablePanel);
 * ```
 *
 * @template {new (...args: any[]) => HTMLElement} T
 * @param {T} subclass - Classe base à qual o mixin será aplicado.
 * @returns {T} Nova classe que estende a classe base com comportamento de sombra de scroll.
 */
export const ScrollShadowMixin = (subclass) =>
  class extends subclass {
    /**
     * Define as propriedades observáveis do mixin.
     *
     * @property {boolean} noScroll - Indica se não há mais conteúdo rolável.
     * Quando `true`, significa que todo o conteúdo está visível (sem overflow).
     * Reflete para o atributo `no-scroll`.
     *
     * @property {HTMLElement} _main - Referência interna ao elemento principal com ID `#main`.
     * Não reflete como atributo.
     *
     * @returns {object} Mapa de propriedades compatível com LitElement.
     */
    static get properties() {
      return {
        noScroll: {
          type: Boolean,
          reflect: true,
          attribute: 'no-scroll',
        },
        _main: {
          attribute: false,
        },
      };
    }

    /**
     * Ciclo de vida chamado após o componente ser renderizado pela primeira vez.
     * Localiza o elemento `#main` no shadow DOM e adiciona um listener de scroll,
     * que atualiza o estado da propriedade `noScroll` conforme o usuário rola.
     *
     * @override
     */
    firstUpdated() {
      super.firstUpdated();

      this._main = this.shadowRoot.querySelector('#main');

      if (this._main) {
        this._main.addEventListener('scroll', () => this._contentScroll());
        this._contentScroll();
      }
    }

    /**
     * Verifica a posição atual do scroll no elemento `#main` e define
     * a propriedade `noScroll` como `true` quando o conteúdo visível
     * alcança o final (ou quando não há rolagem disponível).
     *
     * Este método é chamado tanto no evento `scroll` como na inicialização.
     *
     * @private
     */
    _contentScroll() {
      if (this._main) {
        this.noScroll =
          this._main.scrollHeight - this._main.scrollTop ==
          this._main.clientHeight;
      }
    }
  };

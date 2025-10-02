/**
 * `ScrollShadowMixin` adiciona lógica para gerir o atributo `no-scroll`
 * de um componente baseado em LitElement (ou outro que use shadow DOM).
 *
 * O mixin verifica se o elemento com id `#main` dentro do shadowRoot:
 * - Possui conteúdo com scroll (ou seja, `scrollHeight > clientHeight`).
 * - Está totalmente scrolado até ao fundo.
 *
 * Quando o conteúdo atinge o fundo, a propriedade/atributo `no-scroll`
 * é definida como `true`, permitindo que o componente adapte o estilo
 * (por exemplo, removendo sombras visuais quando não há mais conteúdo
 * escondido).
 *
 * ### Exemplo de utilização:
 * ```javascript
 * class MyScrollableComponent extends ScrollShadowMixin(LitElement) {
 *   render() {
 *     return html`
 *       <div id="main">
 *         <!-- Conteúdo scrollável -->
 *       </div>
 *     `;
 *   }
 * }
 * ```
 *
 * @mixin ScrollShadowMixin
 *
 * @property {boolean} noScroll - Indica se o conteúdo atingiu o fundo (sem mais scroll disponível).
 *                                É refletido como atributo `no-scroll`.
 * @property {HTMLElement} _main - Referência interna ao elemento com `id="main"` dentro do shadow DOM.
 *
 * @fires no-scroll-changed - Embora não dispare explicitamente, esta propriedade refletida pode ser observada externamente via atributo.
 */
export const ScrollShadowMixin = (subclass) =>
    class extends subclass {
        /**
         * Define as propriedades observáveis do mixin.
         *
         * - `noScroll`: (boolean) Reflete o estado de scroll no atributo `no-scroll`.
         * - `_main`: (HTMLElement) Referência interna para o contentor scrollável.
         *
         * @returns {object} Definição de propriedades para o LitElement.
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
         * Ciclo de vida: chamado após a primeira renderização.
         *
         * - Obtém a referência para o elemento `#main` no shadowRoot.
         * - Adiciona listener de `scroll` para atualizar o estado `noScroll`.
         * - Faz uma chamada inicial a `_contentScroll()` para definir o estado correto.
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
         * Método interno para verificar a posição do scroll.
         *
         * Define `noScroll = true` se:
         * - A soma de `scrollTop` e `clientHeight` for igual ao `scrollHeight`,
         *   ou seja, quando o utilizador atingiu o final do conteúdo.
         *
         * Caso contrário, `noScroll = false`.
         */
        _contentScroll() {
            if (this._main) {
                this.noScroll =
                    this._main.scrollHeight - this._main.scrollTop ==
                    this._main.clientHeight;
            }
        }
    };

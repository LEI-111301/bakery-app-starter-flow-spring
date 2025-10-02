import { html, css, LitElement } from 'lit';
import '@vaadin/button';
import '@vaadin/checkbox';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/text-field';

/**
 * `search-bar` é um Web Component baseado em LitElement que fornece
 * uma barra de pesquisa flexível, com campo de texto, botão de ação,
 * checkbox opcional e botão para limpar a pesquisa.
 *
 * ### Funcionalidades principais:
 * - Campo de pesquisa com ícone prefixado.
 * - Botão de ação configurável (ícone + texto).
 * - Checkbox opcional para filtros adicionais (mostrado em desktop ou mobile).
 * - Botão de limpar pesquisa, visível apenas quando existem filtros ativos.
 * - Comportamento responsivo entre mobile e desktop.
 * - Emite eventos personalizados sempre que o valor do campo ou do checkbox muda.
 *
 * ### Exemplo de utilização:
 * ```html
 * <search-bar
 *   field-placeholder="Pesquisar produtos..."
 *   button-text="Adicionar"
 *   button-icon="vaadin:plus"
 *   checkbox-text="Mostrar só disponíveis"
 *   show-checkbox
 * ></search-bar>
 * ```
 *
 * @element search-bar
 *
 * @fires field-value-changed - Disparado quando o valor do campo de pesquisa é alterado.
 * @fires checkbox-checked-changed - Disparado quando o estado do checkbox é alterado.
 * @fires search-focus - Disparado quando o campo de pesquisa ganha foco.
 * @fires search-blur - Disparado quando o campo de pesquisa perde foco.
 *
 * @cssprop --lumo-space-s - Espaçamento pequeno.
 * @cssprop --lumo-space-m - Espaçamento médio.
 * @cssprop --lumo-shade-20pct - Cor usada em sombras e fundo.
 * @cssprop --lumo-base-color - Cor de fundo da barra.
 */
class SearchBar extends LitElement {
    /**
     * Estilos CSS aplicados ao componente.
     *
     * - Estrutura flexível em colunas.
     * - Sombra para destacar a barra de pesquisa.
     * - Comportamento responsivo: em ecrãs maiores, a barra reposiciona elementos.
     * - Mostra/esconde botões e checkboxes consoante os atributos
     *   `show-extra-filters` e `show-checkbox`.
     *
     * @returns {import('lit').CSSResult} Estilos CSS do componente.
     */
    static get styles() {
        return css`
            :host {
                position: relative;
                z-index: 2;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                padding: 0 var(--lumo-space-s);
                background-image: linear-gradient(
                        var(--lumo-shade-20pct),
                        var(--lumo-shade-20pct)
                );
                background-color: var(--lumo-base-color);
                box-shadow: 0 0 16px 2px var(--lumo-shade-20pct);
                order: 1;
                width: 100%;
                height: 48px;
                box-sizing: border-box;
            }

            .row {
                display: flex;
                align-items: center;
                height: 3em;
            }

            .checkbox,
            .clear-btn,
            :host([show-extra-filters]) .action-btn {
                display: none;
            }

            :host([show-extra-filters]) .clear-btn {
                display: block;
            }

            :host([show-checkbox]) .checkbox.mobile {
                display: block;
                transition: all 0.5s;
                height: 0;
            }

            :host([show-checkbox][show-extra-filters]) .checkbox.mobile {
                height: 2em;
            }

            .field {
                flex: 1;
                width: auto;
                padding-right: var(--lumo-space-s);
            }

            @media (min-width: 700px) {
                :host {
                    order: 0;
                }

                .row {
                    width: 100%;
                    max-width: 964px;
                    margin: 0 auto;
                }

                .field {
                    padding-right: var(--lumo-space-m);
                }

                :host([show-checkbox][show-extra-filters]) .checkbox.desktop {
                    display: block;
                }

                :host([show-checkbox][show-extra-filters]) .checkbox.mobile {
                    display: none;
                }
            }
        `;
    }

    /**
     * Template principal do componente.
     *
     * Estrutura:
     * - **TextField** (`vaadin-text-field`): campo de pesquisa com ícone.
     * - **Checkbox (desktop)**: filtro opcional, visível em ecrãs grandes.
     * - **Botão de limpar pesquisa** (`clear-btn`).
     * - **Botão de ação** (`action-btn`), só visível quando filtros extra estão ativos.
     * - **Checkbox (mobile)**: versão alternativa mostrada em ecrãs pequenos.
     *
     * @returns {import('lit').TemplateResult} Template HTML do componente.
     */
    render() {
        return html`
            <div class="row">
                <vaadin-text-field
                        id="field"
                        class="field"
                        .placeholder="${this.fieldPlaceholder}"
                        .value="${this.fieldValue}"
                        @value-changed="${(e) => (this.fieldValue = e.detail.value)}"
                        @focus="${this._onFieldFocus}"
                        @blur="${this._onFieldBlur}"
                        theme="white"
                >
                    <vaadin-icon icon="${this.fieldIcon}" slot="prefix"></vaadin-icon>
                </vaadin-text-field>

                <vaadin-checkbox
                        class="checkbox desktop"
                        .checked="${this.checkboxChecked}"
                        @checked-changed="${(e) => (this.checkboxChecked = e.detail.value)}"
                        @focus="${this._onFieldFocus}"
                        @blur="${this._onFieldBlur}"
                        .label="${this.checkboxText}"
                ></vaadin-checkbox>

                <vaadin-button id="clear" class="clear-btn" theme="tertiary">
                    ${this.clearText}
                </vaadin-button>

                <vaadin-button id="action" class="action-btn" theme="primary">
                    <vaadin-icon icon="${this.buttonIcon}" slot="prefix"></vaadin-icon>
                    ${this.buttonText}
                </vaadin-button>
            </div>

            <vaadin-checkbox
                    class="checkbox mobile"
                    .checked="${this.checkboxChecked}"
                    @checked-changed="${(e) => (this.checkboxChecked = e.detail.value)}"
                    @focus="${this._onFieldFocus}"
                    @blur="${this._onFieldBlur}"
                    .label="${this.checkboxText}"
            ></vaadin-checkbox>
        `;
    }

    /**
     * Nome da tag do componente.
     *
     * @returns {string} `"search-bar"`.
     */
    static get is() {
        return 'search-bar';
    }

    /**
     * Propriedades observáveis do componente.
     *
     * @property {string} fieldPlaceholder - Placeholder do campo de pesquisa.
     * @property {string} fieldValue - Valor atual do campo de pesquisa.
     * @property {string} fieldIcon - Ícone prefixado no campo.
     * @property {string} buttonIcon - Ícone do botão de ação.
     * @property {string} buttonText - Texto do botão de ação.
     * @property {boolean} showCheckbox - Define se o checkbox deve ser mostrado.
     * @property {string} checkboxText - Texto do checkbox.
     * @property {boolean} checkboxChecked - Estado do checkbox.
     * @property {string} clearText - Texto do botão de limpar.
     * @property {boolean} showExtraFilters - Mostra filtros extra (atributo refletido).
     * @property {boolean} _focused - Estado interno de foco do campo.
     *
     * @returns {object} Definição das propriedades.
     */
    static get properties() {
        return {
            fieldPlaceholder: { type: String },
            fieldValue: { type: String },
            fieldIcon: { type: String },
            buttonIcon: { type: String },
            buttonText: { type: String },
            showCheckbox: { type: Boolean, reflect: true, attribute: 'show-checkbox' },
            checkboxText: { type: String },
            checkboxChecked: { type: Boolean },
            clearText: { type: String },
            showExtraFilters: { type: Boolean, reflect: true, attribute: 'show-extra-filters' },
            _focused: { type: Boolean },
        };
    }

    /**
     * Ciclo de vida: chamado sempre que uma propriedade observável muda.
     *
     * - Aciona a função de debounce para atualizar `showExtraFilters`.
     * - Emite eventos customizados quando `fieldValue` ou `checkboxChecked` mudam.
     *
     * @param {Map<string, any>} changedProperties Propriedades alteradas.
     */
    updated(changedProperties) {
        if (
            changedProperties.has('fieldValue') ||
            changedProperties.has('checkboxChecked') ||
            changedProperties.has('_focused')
        ) {
            this._debounceSearch(
                this.fieldValue,
                this.checkboxChecked,
                this._focused
            );
        }

        const notifyingProperties = [
            { property: 'fieldValue', eventName: 'field-value-changed' },
            { property: 'checkboxChecked', eventName: 'checkbox-checked-changed' },
        ];

        notifyingProperties.forEach(({ property, eventName }) => {
            if (changedProperties.has(property)) {
                this.dispatchEvent(
                    new CustomEvent(eventName, {
                        bubbles: true,
                        composed: true,
                        detail: { value: this[property] },
                    })
                );
            }
        });
    }

    /**
     * Construtor: inicializa valores por defeito e define debounce.
     */
    constructor() {
        super();
        this.buttonIcon = 'vaadin:plus';
        this.fieldIcon = 'vaadin:search';
        this.clearText = 'Clear search';
        this.showExtraFilters = false;
        this.showCheckbox = false;

        // Em iOS previne scroll do body quando o teclado é aberto
        this.addEventListener('touchmove', (e) => e.preventDefault());

        this._debounceSearch = debounce((fieldValue, checkboxChecked, focused) => {
            this.showExtraFilters = fieldValue || checkboxChecked || focused;
        }, 1);
    }

    /**
     * Handler: quando o campo ganha foco.
     *
     * - Define `_focused = true`.
     * - Dispara evento `search-focus` se o campo for o text-field.
     *
     * @param {FocusEvent} e Evento de foco.
     */
    _onFieldFocus(e) {
        if (e.currentTarget.id === 'field') {
            this.dispatchEvent(
                new Event('search-focus', { bubbles: true, composed: true })
            );
        }
        this._focused = true;
    }

    /**
     * Handler: quando o campo perde foco.
     *
     * - Define `_focused = false`.
     * - Dispara evento `search-blur` se o campo for o text-field.
     *
     * @param {FocusEvent} e Evento de blur.
     */
    _onFieldBlur(e) {
        if (e.currentTarget.id === 'field') {
            this.dispatchEvent(
                new Event('search-blur', { bubbles: true, composed: true })
            );
        }
        this._focused = false;
    }
}

customElements.define(SearchBar.is, SearchBar);

/**
 * Função utilitária de debounce.
 *
 * @param {Function} func Função a ser executada.
 * @param {number} [delay=0] Tempo de espera em ms antes da execução.
 * @returns {Function} Função com debounce aplicado.
 */
function debounce(func, delay = 0) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

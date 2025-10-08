/**
 * @module SearchBar
 * @description
 * Componente web baseado em LitElement que fornece uma barra de pesquisa interativa
 * com campo de texto, botão de ação, botão de limpeza e opção de filtro via checkbox.
 *
 * Este componente usa elementos Vaadin (`vaadin-text-field`, `vaadin-button`, `vaadin-checkbox`, `vaadin-icon`).
 * É responsivo e adapta-se a ecrãs móveis e desktop.
 *
 * @example
 * <search-bar
 *   fieldPlaceholder="Pesquisar..."
 *   buttonText="Adicionar"
 *   checkboxText="Ativo"
 *   show-checkbox
 * ></search-bar>
 *
 * @fires field-value-changed - Disparado quando o valor do campo de texto muda.
 * @fires checkbox-checked-changed - Disparado quando o estado do checkbox muda.
 * @fires search-focus - Disparado quando o campo de pesquisa ganha foco.
 * @fires search-blur - Disparado quando o campo de pesquisa perde foco.
 */

import { html, css, LitElement } from 'lit';
import '@vaadin/button';
import '@vaadin/checkbox';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/text-field';

class SearchBar extends LitElement {
  /**
   * @returns {CSSResult}
   * Estilos CSS aplicados ao componente.
   */
  static get styles() {
    return css`
      /* ... estilos omitidos para brevidade ... */
    `;
  }

  /**
   * @returns {TemplateResult}
   * Renderiza o template HTML do componente.
   */
  render() {
    return html`
      <!-- Estrutura principal da barra de pesquisa -->
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

  /** @readonly */
  static get is() {
    return 'search-bar';
  }

  /**
   * @returns {Object}
   * Define as propriedades reativas do componente.
   */
  static get properties() {
    return {
      /** Placeholder do campo de texto. */
      fieldPlaceholder: { type: String },

      /** Valor atual do campo de texto. */
      fieldValue: { type: String },

      /** Ícone exibido no campo de texto. */
      fieldIcon: { type: String },

      /** Ícone exibido no botão principal. */
      buttonIcon: { type: String },

      /** Texto exibido no botão principal. */
      buttonText: { type: String },

      /** Controla a exibição do checkbox. */
      showCheckbox: { type: Boolean, reflect: true, attribute: 'show-checkbox' },

      /** Texto exibido junto ao checkbox. */
      checkboxText: { type: String },

      /** Estado atual do checkbox. */
      checkboxChecked: { type: Boolean },

      /** Texto exibido no botão de limpar. */
      clearText: { type: String },

      /** Controla a visibilidade de filtros adicionais. */
      showExtraFilters: { type: Boolean, reflect: true, attribute: 'show-extra-filters' },

      /** Estado interno de foco do campo. */
      _focused: { type: Boolean },
    };
  }

  /**
   * @constructor
   * Cria uma nova instância do componente e define valores padrão.
   */
  constructor() {
    super();
    this.buttonIcon = 'vaadin:plus';
    this.fieldIcon = 'vaadin:search';
    this.clearText = 'Clear search';
    this.showExtraFilters = false;
    this.showCheckbox = false;

    // Evita scroll no iOS quando o teclado é aberto.
    this.addEventListener('touchmove', (e) => e.preventDefault());

    /**
     * Função interna que aplica debounce na atualização da pesquisa.
     * @private
     */
    this._debounceSearch = debounce((fieldValue, checkboxChecked, focused) => {
      this.showExtraFilters = fieldValue || checkboxChecked || focused;
    }, 1);
  }

  /**
   * Atualiza o componente e despacha eventos quando certas propriedades mudam.
   * @param {Map} changedProperties - Propriedades modificadas.
   */
  updated(changedProperties) {
    if (
      changedProperties.has('fieldValue') ||
      changedProperties.has('checkboxChecked') ||
      changedProperties.has('_focused')
    ) {
      this._debounceSearch(this.fieldValue, this.checkboxChecked, this._focused);
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
   * Evento disparado quando o campo de texto ganha foco.
   * @param {FocusEvent} e
   * @private
   */
  _onFieldFocus(e) {
    if (e.currentTarget.id === 'field') {
      this.dispatchEvent(new Event('search-focus', { bubbles: true, composed: true }));
    }
    this._focused = true;
  }

  /**
   * Evento disparado quando o campo de texto perde foco.
   * @param {FocusEvent} e
   * @private
   */
  _onFieldBlur(e) {
    if (e.currentTarget.id === 'field') {
      this.dispatchEvent(new Event('search-blur', { bubbles: true, composed: true }));
    }
    this._focused = false;
  }
}

customElements.define(SearchBar.is, SearchBar);

/**
 * Função utilitária para aplicar debounce a uma função.
 * @param {Function} func - Função a ser chamada com atraso.
 * @param {number} [delay=0] - Tempo de espera em milissegundos.
 * @returns {Function} - Função debounced.
 */
function debounce(func, delay = 0) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

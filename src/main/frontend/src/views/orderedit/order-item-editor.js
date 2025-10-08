/**
 * @module OrderItemEditor
 * @description
 * Componente web responsável por **editar itens individuais de um pedido** dentro do editor principal de pedidos (`<order-editor>`).
 *
 * Baseado em [`LitElement`](https://lit.dev/docs/api/LitElement/), o `OrderItemEditor` utiliza
 * componentes **Vaadin** para fornecer um layout de formulário totalmente responsivo,
 * permitindo selecionar produtos, definir quantidades, adicionar comentários e remover itens.
 *
 * ---
 * ### Principais recursos:
 * - Seleção de produto via `<vaadin-combo-box>`;
 * - Definição de quantidade com `<vaadin-integer-field>`;
 * - Campo de observações do item (`<vaadin-text-field>`);
 * - Exibição automática do preço;
 * - Botão de exclusão individual para remover o item do pedido.
 *
 * ---
 * @example
 * ```html
 * <order-item-editor></order-item-editor>
 * ```
 *
 * @extends {LitElement}
 */
import { html, css, LitElement } from 'lit';
import '@vaadin/button';
import '@vaadin/combo-box';
import '@vaadin/form-layout';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/integer-field';
import '@vaadin/text-field';
import { sharedStyles } from '../../../styles/shared-styles.js';

class OrderItemEditor extends LitElement {
  /**
   * Define os estilos CSS aplicados ao componente.
   * Inclui espaçamento entre campos, layout responsivo e correções visuais.
   *
   * @returns {CSSResultGroup}
   */
  static get styles() {
    return [
      sharedStyles,
      css`
        .product {
          margin-bottom: 1em;
        }

        .delete {
          min-width: 2em;
          padding: 0;
        }

        @media (max-width: 700px) {
          vaadin-form-layout {
            --vaadin-form-layout-column-spacing: 1em;
          }
        }

        .money {
          text-align: right;
          line-height: 2.5em;
        }

        /* Workaround para distorção vertical em elementos flex no IE11 */
        .self-start {
          align-self: flex-start;
        }
      `,
    ];
  }

  /**
   * Renderiza o layout do editor de item de pedido.
   *
   * Estrutura:
   * - **Linha principal (`form1`)**: contém o formulário do produto e o botão de exclusão;
   * - **Formulário interno (`form2`)**: agrupa campos do produto, quantidade, preço e comentário.
   *
   * Campos:
   * - `products`: seleção de produto;
   * - `amount`: quantidade (1–15 unidades);
   * - `price`: exibição do valor total do item;
   * - `comment`: campo de observações adicionais;
   * - `delete`: botão de exclusão do item.
   *
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <vaadin-form-layout
        id="form1"
        .responsiveSteps="${this.form1responsiveSteps}"
      >
        <vaadin-form-layout
          id="form2"
          colspan="16"
          class="product"
          style="flex: auto;"
          .responsiveSteps="${this.form2responsiveSteps}"
        >
          <!-- Seleção de produto -->
          <vaadin-combo-box id="products" colspan="8"></vaadin-combo-box>

          <!-- Quantidade -->
          <vaadin-integer-field
            id="amount"
            colspan="4"
            class="self-start"
            min="1"
            max="15"
            step-buttons-visible
            prevent-invalid-input
          ></vaadin-integer-field>

          <!-- Preço do item -->
          <div id="price" colspan="4" class="money"></div>

          <!-- Comentário do item -->
          <vaadin-text-field
            id="comment"
            colspan="12"
            placeholder="Details"
          ></vaadin-text-field>
        </vaadin-form-layout>

        <!-- Botão para remover o item -->
        <vaadin-button class="delete self-start" id="delete" colspan="2">
          <vaadin-icon icon="vaadin:close-small"></vaadin-icon>
        </vaadin-button>
      </vaadin-form-layout>
    `;
  }

  /**
   * Nome do custom element.
   * @readonly
   * @returns {string}
   */
  static get is() {
    return 'order-item-editor';
  }

  /**
   * Construtor do componente.
   * Inicializa as configurações de responsividade dos formulários internos (`form1` e `form2`).
   *
   * O `form1` define a estrutura principal com 24 colunas.
   * O `form2` define a distribuição dos campos de produto, quantidade e preço.
   */
  constructor() {
    super();

    /**
     * Configuração de responsividade do formulário principal (`form1`).
     * @type {{ minWidth?: string; columns: number; labelsPosition?: "top" | "aside"; }[]}
     */
    this.form1responsiveSteps = [{ columns: 24 }];

    /**
     * Configuração de responsividade do formulário interno (`form2`).
     * Ajusta a quantidade de colunas de acordo com a largura da tela.
     * @type {{ minWidth?: string; columns: number; labelsPosition?: "top" | "aside"; }[]}
     */
    this.form2responsiveSteps = [
      { columns: 8, labelsPosition: 'top' },
      { minWidth: '500px', columns: 16, labelsPosition: 'top' },
    ];
  }
}

customElements.define(OrderItemEditor.is, OrderItemEditor);

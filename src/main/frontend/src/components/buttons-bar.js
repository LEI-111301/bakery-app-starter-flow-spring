import { html, css, LitElement } from 'lit';

/**
 * `buttons-bar` é um Web Component baseado em LitElement.
 * 
 * Este componente cria uma barra flexível que pode conter botões e informação adicional.
 * Pode ser usado para organizar botões à esquerda e à direita, bem como mostrar informação
 * no centro/direita.
 *
 * @element buttons-bar
 *
 * @slot left - Área à esquerda da barra (normalmente botões).
 * @slot info - Área central/direita da barra para mostrar informação adicional.
 * @slot right - Área à direita da barra (normalmente botões).
 *
 * @csspart info - Parte estilizada que contém a informação.
 *
 * @cssprop --lumo-space-s - Espaçamento superior da barra.
 * @cssprop --lumo-space-xs - Espaçamento entre botões.
 * @cssprop --lumo-shade-20pct - Cor usada para a sombra da barra.
 */
class ButtonsBarElement extends LitElement {
  /**
   * Estilos CSS aplicados ao componente.
   *
   * - Usa `flexbox` para organizar os elementos.
   * - Adiciona `box-shadow` no topo.
   * - Remove a sombra quando o atributo `no-scroll` está presente.
   */
  static get styles() {
    return css`
      :host {
        flex: none;
        display: flex;
        flex-wrap: wrap;
        transition: box-shadow 0.2s;
        justify-content: space-between;
        padding-top: var(--lumo-space-s);
        align-items: baseline;
        box-shadow: 0 -3px 3px -3px var(--lumo-shade-20pct);
      }

      :host([no-scroll]) {
        box-shadow: none;
      }

      :host ::slotted([slot='info']),
      .info {
        text-align: right;
        flex: 1;
      }

      ::slotted(vaadin-button) {
        margin: var(--lumo-space-xs);
      }

      @media (max-width: 600px) {
        :host ::slotted([slot='info']) {
          order: -1;
          min-width: 100%;
          flex-basis: 100%;
        }
      }
    `;
  }

  /**
   * Renderiza o template do componente.
   *
   * @returns {import('lit').TemplateResult} Template HTML do componente.
   */
  render() {
    return html`
      <slot name="left"></slot>
      <slot name="info"><div class="info"></div></slot>
      <slot name="right"></slot>
    `;
  }

  /**
   * Identificador do Web Component.
   *
   * @returns {string} Nome da tag do componente.
   */
  static get is() {
    return 'buttons-bar';
  }
}

customElements.define(ButtonsBarElement.is, ButtonsBarElement);

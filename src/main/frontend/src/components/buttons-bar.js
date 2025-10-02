import { html, css, LitElement } from 'lit';

/**
 * `buttons-bar` é um Web Component baseado em LitElement.
 *
 * Este componente cria uma barra flexível que pode conter botões e informação adicional.
 *
 * A estrutura é composta por três áreas:
 * - **Esquerda (slot "left")**: destinada a botões ou ações principais.
 * - **Centro/Direita (slot "info")**: usada para mostrar informação contextual ou status.
 * - **Direita (slot "right")**: destinada a botões ou ações secundárias.
 *
 * ### Exemplo de utilização:
 * ```html
 * <buttons-bar>
 *   <vaadin-button slot="left">Voltar</vaadin-button>
 *   <span slot="info">3 itens selecionados</span>
 *   <vaadin-button slot="right">Confirmar</vaadin-button>
 * </buttons-bar>
 * ```
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
     * - Usa `flexbox` para organizar os elementos em linha.
     * - Define espaçamentos consistentes entre botões e conteúdo.
     * - Aplica uma sombra na parte superior da barra para destacar a separação.
     * - Remove a sombra quando o atributo `no-scroll` está presente no componente.
     *
     * Também contém **regras responsivas**:
     * - Em ecrãs pequenos (`max-width: 600px`), o slot `info` passa para a
     *   primeira linha, ocupando toda a largura disponível.
     *
     * @returns {import('lit').CSSResult} Regras CSS do componente.
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
     * Estrutura principal:
     * - `<slot name="left"></slot>`: área para botões à esquerda.
     * - `<slot name="info"></slot>`: área central/direita para mostrar informação.
     * - `<slot name="right"></slot>`: área para botões à direita.
     *
     * Caso o slot `info` esteja vazio, é renderizado um `<div class="info"></div>` como fallback.
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
     * Este getter fornece o nome da tag personalizada
     * para ser registada no `customElements`.
     *
     * @returns {string} Nome da tag do componente (`"buttons-bar"`).
     */
    static get is() {
        return 'buttons-bar';
    }
}

customElements.define(ButtonsBarElement.is, ButtonsBarElement);

/**
 * `storefront-view` é o componente principal da página de pedidos/loja.
 *
 * Funcionalidades:
 * - Exibe uma barra de pesquisa (`search-bar`) com opção de checkbox.
 * - Mostra uma grade (`vaadin-grid`) para listar pedidos.
 * - Contém um diálogo (`vaadin-dialog`) para detalhes ou ações sobre pedidos.
 *
 * @element storefront-view
 *
 * @example
 * <storefront-view></storefront-view>
 *
 * @csspart search-bar - Barra de pesquisa no topo.
 * @csspart grid - Grade de pedidos.
 * @csspart dialog - Diálogo para detalhes de pedidos.
 */
class StorefrontView extends LitElement {
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

    render() {
        return html`
            <search-bar id="search" show-checkbox></search-bar>
            <vaadin-grid id="grid" theme="orders no-row-borders"></vaadin-grid>
            <vaadin-dialog id="dialog" theme="orders"></vaadin-dialog>
        `;
    }

    static get is() {
        return 'storefront-view';
    }

    /**
     * Lifecycle method chamado quando o elemento está pronto.
     * Adiciona listener para medir performance do carregamento da página.
     */
    ready() {
        super.ready();

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

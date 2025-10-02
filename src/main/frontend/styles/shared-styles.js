import { css } from "lit";

/**
 * sharedStyles: estilos compartilhados para todos os componentes LitElement
 */
export const sharedStyles = css`
    /* Box sizing universal e suporte a elementos slotted */
    *,
    *::before,
    *::after,
    ::slotted(*) {
        box-sizing: border-box;
    }

    /* Ocultar elementos com [hidden] */
    :host([hidden]),
    [hidden] {
        display: none !important;
    }

    /* Headings h2 e h3 com espaçamento padrão */
    h2,
    h3 {
        margin-top: var(--lumo-space-m);
        margin-bottom: var(--lumo-space-s);
    }

    h2 {
        font-size: var(--lumo-font-size-xxl);
    }

    h3 {
        font-size: var(--lumo-font-size-xl);
    }

    /* Scrollable containers */
    .scrollable {
        padding: var(--lumo-space-m);
        overflow: auto;
        -webkit-overflow-scrolling: touch; /* smooth scroll em iOS */
    }

    /* Badge ou contador com estilo uniforme */
    .count {
        display: inline-block;
        background: var(--lumo-shade-10pct);
        border-radius: var(--lumo-border-radius);
        font-size: var(--lumo-font-size-s);
        padding: 0 var(--lumo-space-s);
        text-align: center;
    }

    /* Total price ou valores destacados */
    .total {
        padding: 0 var(--lumo-space-s);
        font-size: var(--lumo-font-size-l);
        font-weight: bold;
        white-space: nowrap;
    }

    @media (min-width: 600px) {
        .total {
            min-width: 0;
            order: 0;
            padding: 0 var(--lumo-space-l);
        }
    }

    /* Flex utilities */
    .flex {
        display: flex;
    }

    .flex1 {
        flex: 1 1 auto;
    }

    /* Bold text utility */
    .bold {
        font-weight: 600;
    }
`;

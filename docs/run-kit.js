/* globals RunKit */

customElements.define('run-kit', class extends HTMLElement {
  connectedCallback() {
    const code = this.querySelector('pre')

    RunKit.createNotebook({
      element: this,
      source: code.textContent.trim(),
    })
  }
})

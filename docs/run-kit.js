/* globals RunKit */

customElements.define('run-kit', class extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({
      mode: 'open',
    })

    root.appendChild(document.createElement('slot'))
    const code = this.querySelector('pre')

    this.runKit = RunKit.createNotebook({
      element: this,
      gutterStyle: 'inside',
      source: code.textContent.trim(),
    })

    this.runKit.onLoad = () => code.remove()
  }
})

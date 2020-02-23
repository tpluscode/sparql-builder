/* globals RunKit */

customElements.define('run-kit', class extends HTMLElement {
  connectedCallback() {
    fetch(this.getAttribute('src'))
      .then(res => res.text())
      .then(source => {
        this.runKit = RunKit.createNotebook({
          element: this,
          source,
          evaluateOnLoad: true,
        })
      })
  }
})

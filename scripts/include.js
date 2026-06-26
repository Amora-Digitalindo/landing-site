// Vanilla JS component loader. No build step: each component lives in its own
// .html file under components/, fetched and injected at runtime.
// Usage: <div data-include="components/shared/navbar.html" data-base="index.html"></div>
// data-* attributes (besides data-include) become {{camelCase}} tokens replaced
// in the fetched partial — the only templating capability this loader has.
(function () {
  function toCamel(attrName) {
    return attrName.slice('data-'.length).replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  }

  function fillTemplate(html, data) {
    return html.replace(/\{\{(\w+)\}\}/g, (_, key) => (key in data ? data[key] : ''));
  }

  async function resolveInclude(el) {
    const src = el.getAttribute('data-include');
    const data = {};
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('data-') && attr.name !== 'data-include') {
        data[toCamel(attr.name)] = attr.value;
      }
    }
    const res = await fetch(src);
    if (!res.ok) throw new Error(`Failed to load component: ${src}`);
    const raw = await res.text();
    el.outerHTML = fillTemplate(raw, data);
  }

  window.loadIncludes = async function loadIncludes() {
    const nodes = Array.from(document.querySelectorAll('[data-include]'));
    await Promise.all(nodes.map(resolveInclude));
  };

  // Loads a classic script tag and resolves once it has executed, so callers
  // can sequence scripts that assume prior DOM/script state (global.js before
  // landing.js, etc.) the same way consecutive <script> tags would.
  window.loadScript = function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  };
})();

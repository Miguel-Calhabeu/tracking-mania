export const GET_SPY_SCRIPT = () => `
<script>
(function() {
  const notifyParent = (data) => {


    // Envia para o Pai (Tracking Mania)
    window.parent.postMessage({
      type: 'network_proxy',
      data: data
    }, '*');
  };

  // --- Monkey Patch: fetch ---
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const [resource, config] = args;
    const url = resource.toString();

    notifyParent({
        type: 'fetch',
        method: config?.method || 'GET',
        url: url,
        body: config?.body
    });

    return originalFetch.apply(window, args);
  };

  // --- Monkey Patch: XHR ---
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._spyData = { method, url: url.toString() };
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(body) {
    if (this._spyData) {
        notifyParent({
            type: 'xhr',
            method: this._spyData.method,
            url: this._spyData.url,
            body: body
        });
    }
    return originalSend.apply(this, arguments);
  };

  // --- Monkey Patch: Beacon ---
  const originalBeacon = navigator.sendBeacon;
  navigator.sendBeacon = function(url, data) {
      notifyParent({
        type: 'beacon',
        method: 'POST',
        url: url.toString(),
        body: data
      });
      return originalBeacon.apply(navigator, arguments);
  }

  // --- Monkey Patch: Image (Pixel) ---
  const originalImageSrcDescriptor = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
  if (originalImageSrcDescriptor && originalImageSrcDescriptor.set) {
      Object.defineProperty(Image.prototype, 'src', {
          ...originalImageSrcDescriptor,
          set: function(value) {
              notifyParent({
                  type: 'image',
                  method: 'GET',
                  url: value.toString()
              });
              originalImageSrcDescriptor.set.call(this, value);
          }
      });
  }
})();
</script>
`;

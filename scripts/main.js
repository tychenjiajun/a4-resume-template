/**
 * Resume Print Mode Handler
 * 
 * When the URL contains ?print query parameter, adds a class to the body
 * to enable print preview mode (mimics @media print styles for on-screen viewing).
 */

(function() {
  'use strict';

  /**
   * Check if the URL has ?print query parameter
   * @returns {boolean}
   */
  function isPrintMode() {
    const params = new URLSearchParams(window.location.search);
    return params.has('print');
  }

  /**
   * Enable print preview mode
   */
  function enablePrintPreview() {
    document.body.classList.add('print-preview');
    console.log('[Resume] Print preview mode enabled');
  }

  /**
   * Disable print preview mode
   */
  function disablePrintPreview() {
    document.body.classList.remove('print-preview');
    console.log('[Resume] Print preview mode disabled');
  }

  /**
   * Initialize print mode based on URL
   */
  function init() {
    if (isPrintMode()) {
      enablePrintPreview();
    }

    // Listen for URL changes (e.g., if user adds/removes ?print dynamically)
    window.addEventListener('popstate', () => {
      if (isPrintMode()) {
        enablePrintPreview();
      } else {
        disablePrintPreview();
      }
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

export default defineNuxtPlugin(() => {
  // This plugin runs only on client-side to configure Quill
  if (process.client) {
    // Add RTL direction support for Persian/Arabic text
    const style = document.createElement('style');
    style.textContent = `
      /* RTL support for Quill editor */
      .ql-editor[dir="rtl"] {
        text-align: right;
        direction: rtl;
      }
      
      .ql-editor[dir="rtl"] ul,
      .ql-editor[dir="rtl"] ol {
        padding-right: 1.5em;
        padding-left: 0;
      }
      
      .ql-editor[dir="rtl"] li {
        text-align: right;
      }
      
      .ql-editor[dir="rtl"] blockquote {
        border-right: 4px solid #ccc;
        border-left: none;
        padding-right: 16px;
        padding-left: 0;
      }
      
      /* Persian font optimization */
      .ql-editor {
        font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif;
        line-height: 1.8;
      }
      
      /* Fix placeholder position for RTL */
      .ql-editor.ql-blank::before {
        left: auto !important;
        right: 15px !important;
        text-align: right;
      }
    `;
    document.head.appendChild(style);
  }
});

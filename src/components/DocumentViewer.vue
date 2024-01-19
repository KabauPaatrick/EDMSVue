<template>
  <div class="document-viewer sidebar-mini layout-navbar-fixed layout-fixed text-sm sidebar-light-indigo elevation-4" id="documentViewer" style="overflow: hidden">
    <!-- Add content for right sidebar here -->
    <div class="content y" style="padding-left: 20px; padding-right: 20px; overflow: hidden">
      <div class="row">
        <div class="col-6">
          <div><b style="font-size: 15px"><u><label id="documentTitle"></label></u></b></div>
        </div>
        <div class="col-6">
          <div class="close" @click="hideDocumentViewer">&times;</div>
        </div>
      </div>
    </div>
    <!--------------------------------------------------------------------DASHBOARD PROPERTIES CONTENT-------------------------------------------------------------------->
    <div class="content y" style="padding-left: 30px; padding-right: 20px; height: inherit; overflow: hidden">
      <input type="hidden" value="sampleDesc/Document 0.pdf" id="setSelectedDocument">

      <div class="row h-100">
        <!-- Left Sidebar -->
        <div class="col-1 sidebar" style="float: left">
          <button class="btn btn-secondary btn-sm btn-icon" @click="pdfViewerFirst" title="Select"><span class="material-symbols-outlined">arrow_selector_tool</span></button>
          <!-- Add other buttons here with @click handlers -->
        </div>

        <div class="row col-11 offset-md-0 pdfviewer p-0 row h-100">
          <div class="pdfjs-toolbar text-center row m-0 p-0">
            <div class="col-12 col-lg-6 my-1">
              <!-- Add buttons with @click handlers -->
            </div>
            <div class="col-12 col-lg-6 my-1">
              <!-- Add buttons with @click handlers -->
            </div>
          </div>

          <div id="docViewer" class="pdfjs-viewer" style="height: inherit; width: 100%;" @document-ready="onDocumentReady"></div>
          <button id="loadPdfButton" @click="loadPdf">Load PDF</button>
        </div>
      </div>
    </div>
    <!--------------------------------------------------------------------WORKFLOWS PROPERTIES CONTENT-------------------------------------------------------------------->
  </div>
</template>

<script>
export default {
  data() {
    // ... your existing data
  },
  methods: {
    // ... your existing methods
    // If you've already included PDF.js and its worker in your main HTML file, you may not need these methods
    loadPdfJs() {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
      script.onload = this.loadPdfJsWorker;
      document.head.appendChild(script);
    },
    loadPdfJsWorker() {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      script.onload = this.loadPdfViewer;
      document.head.appendChild(script);
    },
    loadPdfViewer() {
      // Now, you can initialize your PDF viewer, e.g., call displaySelectedPdf() here
    },
    
  },
  // mounted() {
  //   this.loadPdfJs(); // Call this method to start loading PDF.js and dependencies
  // },
};
</script>

<style scoped>
/* Add your scoped styles here */
</style>


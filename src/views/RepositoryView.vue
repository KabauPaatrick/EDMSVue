<!-- eslint-disable vue/no-unused-components -->
<template>
  <!-- ... -->
  <div class="content" :style="{ width: openProperties ? '60vw' : auto }">
    <div class="container-fluid">
      <div class="content y">
        <TopNav @show-list-view="showListView" @show-grid-view="showGridView" @show-properties="showProperties"
          @show-report="showReport" />
        <!-- Direct usage of CabinetList and FolderView components -->
        <ListView :folders="folders" :documents="documents" v-if="listview" />
        <GridView :folders="folders" :documents="documents" v-if="gridview" />
        <ReportView v-if="openReport" />
      </div>
    </div>
  </div><!-- /.container-fluid -->
  <PropertiesSideBar v-if="openProperties" :style="{ width: openProperties ? '30vw' : '0vw' }"
    @hide-sidebar="hideSidebar" />
</template>
  

  
<script>
import ListView from "../components/ListView.vue";
import GridView from "../components/GridView.vue";
import TopNav from "../components/TopNav.vue";
import PropertiesSideBar from "@/components/PropertiesSideBar.vue";
import ReportView from "@/components/ReportView.vue";

export default {
  components: {
    ListView,
    GridView,
    TopNav,
    PropertiesSideBar,
    ReportView
  },
  data() {
    return {
      listview: true,
      gridview: false,
      openReport: false,
      openProperties: false,
      documents: [],
      folders: [],
    };
  },
  methods: {
    showGridView() {
      this.listview = false;
      this.gridview = true;
      this.openReport = false;
    },
    showListView() {
      this.listview = true;
      this.gridview = false;
      this.openReport = false;
    },
    showProperties() {
      this.openProperties = true;
    },
    showReport() {
      this.listview = false;
      this.gridview = false;
      this.openReport = true;
    },
    hideSidebar() {
      this.openProperties = false;
    }
  },
};
</script>
  
<style scoped></style>
  
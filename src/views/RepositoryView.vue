<!-- eslint-disable vue/no-unused-components -->
<template>
    <!-- ... --> 
    <div>

      <!-- ... Other parts of RepositoryView ... -->
  
      <!-- Registered CabinetsView component -->
      <router-view :cabinets="cabinets" @showFolders="showFolders"></router-view>
  
      <!-- FolderView component -->
      <router-view :folders="folders"></router-view>
  
      <!-- Direct usage of CabinetList and FolderView components -->
      <CabinetList :cabinets="cabinets" @showFolders="showFolders" />
      <FolderView :folders="folders" />
    </div>
  </template>
  

  
  <script>
  import CabinetList from "@/components/CabinetList.vue";
  import FolderView from "@/components/FolderView.vue";
  
  export default {
    components: {
      CabinetList,
      FolderView,
    },
    data() {
      return {
        cabinets: [
          // ... Cabinets data ...
        ],
        folders: [],
      };
    },
    methods: {
      showFolders(folders) {
        this.folders = folders;
      },
    },
  };
  </script>
  
  <style scoped></style>
  
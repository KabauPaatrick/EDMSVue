<template>
  <div class="x y">
    <!-- Content of Registered Cabinets -->
    <div class="card elevation-3">
      <div class="card-header">
        <h3 class="card-title"><b>Registered Cabinets</b></h3>
      </div>
      <div class="card-body table-responsive">
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Type</th>
              <th>Size (No of Docs)</th>
              <th>Owner / Modified By</th>
              <th>Date Created / Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in combinedData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.type === 'Folder' ? item.total_documents : item.size + ' Mb' }}</td>
              <td>{{ item.type === 'Folder' ? 'Supervisor' : 'User ' + (index + 1) }}</td>
              <td>{{ item.type === 'Folder' ? '22nd November 2023' : item.lastModified + ' min ago' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer clearfix">
        <ul class="pagination pagination-sm m-0 float-right">
          <li class="page-item"><a class="page-link" href="#">&laquo;</a></li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item"><a class="page-link" href="#">&raquo;</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
  
<script>
// import { inject } from 'vue'
export default {
  data() {
    return {
      baseUrl: this.baseApiUrl
    }
  },
  methods: {
    showFolders(folders) {
      // Emit an event to the parent component (RepositoryView) to show folders
      this.$emit("showFolders", folders);
    },
  },
};
</script>
  
<style scoped></style>
  
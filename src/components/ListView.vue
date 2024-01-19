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
              <th>Cab Name</th>
              <th>No of Folders</th>
              <th>Owner</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            <!-- Render the list of cabinets -->
            <tr v-for="(cabinet, index) in cabinets" :key="index" @click="showFolders(cabinet.folders)">
              <td>{{ index + 1 }}</td>
              <td>{{ cabinet.name }}</td>
              <td>{{ cabinet.folders.length }}</td>
              <td>{{ cabinet.owner }}</td>
              <td>{{ cabinet.dateCreated }}</td>
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
  
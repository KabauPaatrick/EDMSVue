<template>
    <div class="tabv x y">
      <!-- Content of Folders -->
      <div class="card elevation-3">
        <div class="card-header">
          <h3 class="card-title"><b>List of Folders</b></h3>
        </div>
        <div class="card-body table-responsive">
          <table class="table table-hover table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Folder Name</th>
                <th>No of Docs</th>
                <th>Owner</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              <!-- Render the list of folders -->
              <tr v-for="(folder, index) in folders" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ folder.name }}</td>
                <td>{{ folder.docs }}</td>
                <td>{{ folder.owner }}</td>
                <td>{{ folder.dateCreated }}</td>
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
  export default {
    props: {
      folders: Array, // Pass the list of folders as a prop
    },
  };
  </script>
  
  <style scoped></style>
  
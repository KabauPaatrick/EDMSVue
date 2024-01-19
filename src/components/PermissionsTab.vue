<template>
    <div class="permissions-table">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Permission</th>
            <th>Allow</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(permission, index) in permissions" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ permission.permission_name }}</td>
            <td>{{ permission.allow ? 'Yes' : 'No' }}</td>
            <td>
              <!-- Add action buttons here if needed -->
              <!-- e.g., Edit button -->
              <button @click="editPermission(permission)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        permissions: [
          { permission_name: 'View Users', allow: true },
          { permission_name: 'Add User', allow: false },
          // Add more permissions as needed
        ],
      };
    },
    methods: {
      editPermission(permission) {
        // Implement logic to handle editing the permission
        console.log('Editing permission:', permission);
        // You may want to navigate to an edit page or show a modal for editing
      },
    },
  };
  </script>
  
  <style scoped>
  .permissions-table {
    padding: 20px;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .table th {
    background-color: #f2f2f2;
  }
  </style>
  
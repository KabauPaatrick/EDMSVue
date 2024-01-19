<template>
    <div class="indexing-fields-table">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Field Name</th>
            <th>Data Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(field, index) in indexingFields" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ field.field_name }}</td>
            <td>{{ field.field_datatype }}</td>
            <td>
              <!-- Add action buttons here if needed -->
              <!-- e.g., Edit button -->
              <button @click="editField(field)">Edit</button>
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
        indexingFields: [
          { field_name: 'Field 1', field_datatype: 'DataType 1' },
          { field_name: 'Field 2', field_datatype: 'DataType 2' },
          // Add more indexing fields as needed
        ],
      };
    },
    methods: {
      editField(field) {
        // Implement logic to handle editing the indexing field
        console.log('Editing field:', field);
        // You may want to navigate to an edit page or show a modal for editing
      },
    },
  };
  </script>
  
  <style scoped>
  .indexing-fields-table {
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
  
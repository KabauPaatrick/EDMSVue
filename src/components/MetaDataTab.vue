<template>
    <div class="metadata-table">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Attribute</th>
            <th>Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in metadata" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.attribute }}</td>
            <td>
              <!-- Display input field for editing -->
              <input v-if="item.editing" v-model="item.value" />
              <!-- Display value when not editing -->
              <span v-else>{{ item.value }}</span>
            </td>
            <td>
              <!-- Toggle editing mode -->
              <button @click="toggleEdit(item)">{{ item.editing ? 'Save' : 'Edit' }}</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Submit button to save changes -->
      <button @click="submitChanges">Submit Changes</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        metadata: [
          { attribute: 'Attribute 1', value: 'Value 1', editing: false },
          { attribute: 'Attribute 2', value: 'Value 2', editing: false },
          // Add more metadata items as needed
        ],
      };
    },
    methods: {
      toggleEdit(item) {
        // Toggle editing mode
        item.editing = !item.editing;
      },
      submitChanges() {
        // Implement logic to submit changes to the database
        console.log('Changes submitted:', this.metadata);
        // You can send this.metadata to your backend for saving changes to the database
      },
    },
  };
  </script>
  
  <style scoped>
  .metadata-table {
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
  
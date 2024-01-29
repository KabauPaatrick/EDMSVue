<template>
  <div class="permissions-table">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Permission</th>
          <th>Granted</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody v-for="(value, key) in permissions" :key="key">
        <tr v-for="(permission, id) in value" :key="id">
          <template v-if="key < Object.keys(value).length - 26 && !['id','group_id','folder_id'].includes(id) && (id.indexOf('group') < 0) && (id.indexOf('user') < 0) && (id.indexOf('permission') < 0)">
            <td>{{ key++ }}</td>
            <td>{{ id }}</td>
            <td>{{ permission === 1 ? 'True' : 'False' }}</td>
            <td>
              <button class="btn btn-primary" @click="switchPermission(id)">{{ permission === 1 ? 'Remove' :
                'Assign' }}</button>
            </td>
          </template>
        </tr>
      </tbody>
      <!-- <tbody v-for="(value, key) in permissions" :key="key">
        <template v-if="key < permissions.length - 2">
          <tr v-for="(permission, id) in value" :key="id">
            <td>{{ key + 1 }}</td>
            <td>{{ id }}</td>
            <td>{{ permission === 1 ? 'True' : 'False' }}</td>
            <td>
              <button @click="editPermission(id)">Edit</button>
            </td>
          </tr>
        </template>
      </tbody> -->
    </table>
  </div>
</template>
  
<script>
import { useToast } from "vue-toastification";

export default {
  props: {
    current_folder: {},
  },
  data() {
    return {
      toast: useToast(),
      baseUrl: this.baseApiUrl,
      token: localStorage.getItem("edms_token"),
      permissions: null,
      permissions_pagination: {
        links: '',
        meta: ''
      },
    };
  },
  mounted() {
    this.getPermissions(this.$props.current_folder.id, 2);
  },
  methods: {
    async getPermissions(folder_id, group_id) {
      this.permissions = [];
      const response = await fetch(this.baseUrl + '/api/grouppermissions/' + folder_id + '/' + group_id, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-type': 'application/json'
        }
      });
      const data = await response.json();
      // console.log(data.data.data);
      if (data.success == false) {
        // Use it!
        this.toast.error(data.message, {
          timeout: 2000
        });
      } else {
        // Use it!
        this.toast.success(data.message, {
          timeout: 2000
        });
        this.permissions = data.data.data;
        this.permissions_pagination.links = data.data.links;
        this.permissions_pagination.meta = data.data.meta;
      }
    },
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

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}
</style>
  
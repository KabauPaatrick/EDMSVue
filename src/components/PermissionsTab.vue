<template>
	<form class="form-inline" v-on:submit.prevent="createNewGroup">
		<label class="sr-only">Group Name</label>
		<input class="form-control mb-2 mr-sm-2" v-model="newGroupName" placeholder="Group Name">
		<button type="submit" name="createNewGroup" class="btn btn-primary mb-2">Create Group</button>
	</form>


	<div id="accordion">
		<div class="card" v-for="(group, index) in groups" :key="index">
			<div class="card-header" :id="'heading' + group.id">
				<h5 class="mb-0">
					<button class="btn" data-toggle="collapse" :data-target="'#' + group.id" aria-expanded="false"
						:aria-controls="group.id">
						{{ group.group_name }}
					</button>
				</h5>
			</div>

			<div :id="group.id" class="collapse" :aria-labelledby="'heading' + group.id" data-parent="#accordion">
				<div class="card-body">
					<div class="permissions-table">
						<table class="table table-bordered">
							<thead>
								<tr>
									<th>#</th>
									<th>Permission</th>
									<th>Switch</th>
								</tr>
							</thead>
							<tbody
								v-for="(value, key) in group.permissions.filter((permission) => permission.folder_id == current_folder.id)"
								:key="key">
								<tr v-for="(permission, id) in value" :key="id">
									<template
										v-if="key < Object.keys(value).length && !ignoredPermissionsColumn.includes(id)">
										<!-- v-if="key < Object.keys(value).length && !ignoredPermissionsColumn.includes(id) && (id.indexOf('possible_action') < 0) && (id.indexOf('field') < 0) && (id.indexOf('permission') < 0)"> -->
										<td>{{ key++ }}</td>
										<td>{{ id }}</td>
										<td>
											<div class="custom-control custom-switch" @click="switchPermission(value, id)">
												<input type="checkbox" class="custom-control-input" :id="id"
													:checked="permission === 1">
												<label class="custom-control-label" for="customSwitches"></label>
											</div>
										</td>
									</template>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
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
			groups: [],
			newGroupName: "",
			ignoredPermissionsColumn: ['id', 'group_id', 'folder_id', 'created_at', 'updated_at'],
		};
	},
	mounted() {
		this.getGroups(this.$props.current_folder.folder_owner_id);
		// this.getPermissions(this.$props.current_folder.id, 2);
	},
	methods: {
		async getGroups(group_admin_id) {
			const response = await fetch(`${this.baseUrl}/api/groups/` + group_admin_id, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.token}`,
				},
			});
			const data = await response.json();
			this.groups = data.data.data;
		},
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
			}
		},
		async switchPermission(permission, perm_id) {
			permission[perm_id] = permission[perm_id] == 1 ? 0 : 1;
			var { created_at, updated_at, id, ...targetFormData } = permission;
			created_at, updated_at, id

			const response = await fetch(this.baseUrl + '/api/grouppermissions/update/' + permission.id, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					...targetFormData,
				})
			});
			const data = await response.json();
			this.groups.forEach((group) =>{
				if (group.id == data.data.data.group_id) {
					group.permissions = [data.data.data];
				}
			});
			// const target_group = this.groups.find((group) => group.id == data.data.data.group_id);
			// this.groups = this.groups.filter((group) => group.id != data.data.data.group_id);
			// this.groups.push(target_group);
			// this.groups[this.groups.length - 1].permissions = data.data.data;
			// You may want to navigate to an edit page or show a modal for editing
		},
		async createNewGroup() {
			const response = await fetch(this.baseUrl + '/api/groups/store', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					group_name: this.newGroupName,
					group_admin_id: this.$props.current_folder.folder_owner_id
				})
			});
			const data = await response.json();
			this.groups.push(data.data.data);
			await fetch(this.baseUrl + '/api/grouppermissions/store', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					group_id: data.data.data.id,
					folder_id: this.$props.current_folder.id
				})
			});
			await this.getPermissions(this.$props.current_folder.id, data.data.data.id);
			this.groups[this.groups.length - 1].permissions = this.permissions;
		}
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
  
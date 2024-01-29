<template>
	<div>
		<table class="table table-bordered">
			<thead class="thead-light">
				<tr>
					<th>Field Name</th>
					<th>Data Type</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(field, id) in currentFolderFields" :key="id">
					<td>{{ field.field_name }}</td>
					<td v-if="field.field_datatype.split('-')[1]">
						{{ lookups.find(lookup => lookup.id == field.field_datatype.split("-")[1]).name }}
					</td>
					<td v-else>
						{{ field.field_datatype }}
					</td>
					<td>
						<!-- Add action buttons here if needed -->
						<!-- e.g., Edit button -->
						<button class="btn btn-primary" @click="editField(field)">Edit</button>
					</td>
				</tr>
				<tr>
					<td>
						<input v-model="newField.field_name" class="form-control" placeholder="Field Name">
					</td>
					<td>
						<treeselect v-model="newField.field_datatype" :multiple="false" :clearable="true" :searchable="true"
							:disabled="disabled" :open-on-click="true" :open-on-focus="true" :clear-on-select="true"
							:close-on-select="true" :always-open="false" :append-to-body="appendToBody" :options="options"
							:limit="3" :max-height="200" style="width: 8vw;" />
					</td>
					<td>
						<button class="btn btn-success" @click="addItem">Add</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
  
<script>

// import the component
import Treeselect from 'vue3-treeselect';
// import the styles
import 'vue3-treeselect/dist/vue3-treeselect.css';
import { useToast } from "vue-toastification";

export default {
	// register the component
	components: { Treeselect },
	props: {
		document: {},
		current_folder: {},
		serials: Array,
		lookups: Array,
	},
	data() {
		return {
			toast: useToast(),
			baseUrl: this.baseApiUrl,
			token: localStorage.getItem("edms_token"),
			value: null,
			newField: {
				folder_id: null,
				field_name: null,
				field_datatype: null,
			},
			lookups_bases: [],
			serials_bases: [],
		};
	},
	computed: {
		options() {
			// define options
			return [
				{
					"id": 'String',
					"label": 'Text (String)',
				},
				{
					"id": 'Float',
					"label": 'Numeric (Float)',
				},
				{
					"id": 'Datetime',
					"label": 'Datetime',
				},
				{
					"id": 'lookup',
					"label": 'lookup',
					children: this.lookups_bases,
				},
				{
					"id": 'serial',
					"label": 'serial',
					children: this.serials_bases,
				}];
		},
		currentFolderFields() {
			return this.current_folder ? this.current_folder.fields : [];
		}
	},
	mounted() {
		this.$props.lookups.forEach((lookup) => {
			this.lookups_bases.push({ id: 'lookups-' + lookup.id, label: lookup.name });
		});
		this.$props.serials.forEach((serial) => {
			this.lookups_bases.push({ id: serial.id, label: serial.prefix + ' ' + serial.number_format + ' ' + serial.date_format + ' ' + serial.postfix + ' (order: ' + serial.order_of_items + ')' });
		});
	},
	methods: {
		async editField(field) {
			// Implement logic to handle editing the indexing field
			console.log('Editing field:', field);
			field.field_datatype = "Float";
			this.$emit('update-index-field-data', 'update', field);
		},
		async addItem() {
			// Implement logic to handle editing the indexing field
			this.newField.folder_id = this.$props.current_folder.id;
			console.log('Adding field:', this.newField);
			const response = await fetch(this.baseUrl + '/api/folder/fields/store', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					folder_id: this.newField.folder_id,
					field_name: this.newField.field_name,
					field_datatype: this.newField.field_datatype
				})
			});
			const data = await response.json();
			if (data.data == 403) {
				// Use it!
				this.toast.error(data.message, {
					timeout: 5000
				});
			} else {
				// Use it!
				this.toast.success(data.message, {
					timeout: 5000
				});
				this.$emit('update-index-field-data', 'add', data.data.data);
			}

		},
	},
};
</script>
  
<style scoped></style>
  
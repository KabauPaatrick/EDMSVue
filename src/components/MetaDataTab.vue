<template>
	<div>
		<table class="table table-bordered" v-if="document != null">
			<thead class="thead-light">
				<tr>
					<th>Field Name</th>
					<th>Value</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(doc_field, id) in document ? document.doc_fields : []" :key="id">
					<td>{{ doc_field.field.field_name }}</td>
					<td>{{ doc_field.value }}</td>
					<td>
						<button class="btn btn-primary" @click="editField(doc_field)">Edit</button>
					</td>
				</tr>
			</tbody>
		</table>
		<form v-if="showAddNewRow" v-on:submit.prevent="addItem">
			<div class="form-group">
				<label for="Field_name">Field Name</label>
				<treeselect v-model="newDocField.field_id" :multiple="false" :clearable="true" :searchable="true"
					:disabled="disabled" :open-on-click="true" :open-on-focus="true" :clear-on-select="true"
					:close-on-select="true" :always-open="false" :append-to-body="appendToBody" :options="fields_options"
					:limit="3" />
			</div>
			<div class="form-group">
				<label for="value">Value</label>
				<treeselect v-model="newDocField.value" :multiple="false" :clearable="true" :searchable="true"
					:disabled="disabled" :open-on-click="true" :open-on-focus="true" :clear-on-select="true"
					:close-on-select="true" :always-open="false" :append-to-body="appendToBody" :options="lookup_options"
					:limit="3" v-if="showLookupSelector" />
				<input v-model="newDocField.value" class="form-control" placeholder="value" v-else>
			</div>
			<button type="submit" class="btn btn-success" name="addItem">Add</button>
		</form>
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
			newDocField: {
				document_id: null,
				field_id: null,
				value: null,
			},
			lookups_bases: [],
			serials_bases: [],
		};
	},
	computed: {
		fields_options() {
			let fields_array = [];
			// define options
			let valued_fields = [];
			if (this.$props.document != null) {
				if (Object.hasOwn(this.$props.document, 'doc_fields')) {
					if (Object.hasOwn(this.$props.document.folder, 'fields')) {
						this.$props.document.folder.fields.forEach((field) => {
							this.$props.document.doc_fields.forEach((doc_field) => {
								if (field.id == doc_field.field_id) {
									valued_fields.push(field.id);
								}
							})
						});
						this.$props.document.folder.fields.forEach((field) => {
							if (!valued_fields.includes(field.id)) {
								fields_array.push({ id: field.id, label: field.field_name });
							}
						});
					}
					return fields_array;
				}
			}
			return [];
		},
		lookup_options() {
			let lookup_array = [];
			let main_lookup_id = this.$props.document.folder.fields.find(field => field.id == this.newDocField.field_id).field_datatype.split('-')[1];
			let main_lookup = this.$props.lookups.find((lookup) => lookup.id == main_lookup_id);
			main_lookup.children.forEach((child) => {
				lookup_array.push(this.parseItem(child));
			});
			return lookup_array;
		},
		showLookupSelector() {
			if (this.newDocField.field_id) {
				// return true;
				return this.$props.document.folder.fields.find(field => field.id == this.newDocField.field_id).field_datatype.split('-')[0] == 'lookups';
			}
			return false;
		},
		showAddNewRow() {
			return this.fields_options.length > 0;
		},
	},
	mounted() {
		this.$props.lookups.forEach((lookup) => {
			this.lookups_bases.push({ id: lookup.id, label: lookup.name });
		});
		this.$props.serials.forEach((serial) => {
			this.lookups_bases.push({ id: serial.id, label: serial.prefix + ' ' + serial.number_format + ' ' + serial.date_format + ' ' + serial.postfix + ' (order: ' + serial.order_of_items + ')' });
		});
	},
	methods: {
		parseItem(item) {
			return {
				id: item.name,
				label: item.name,
				children: item.children ? item.children.map(child => this.parseItem(child)) : [],
			};
		},
		async editField(field) {
			// Implement logic to handle editing the indexing field
			const response = await fetch(this.baseUrl + '/api/document/docfields/update/' + field.id, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					document_id: field.document_id,
					field_id: field.field_id,
					value: "Me"
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
				this.$emit('update-meta-data-data', "update", data.data);
			}
			// this.$emit('update-meta-data-data', "update", field);
		},
		async addItem() {
			// Implement logic to handle editing the indexing field
			this.newDocField.document_id = this.$props.document.id;
			const response = await fetch(this.baseUrl + '/api/document/docfields/store', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					document_id: this.newDocField.document_id,
					field_id: this.newDocField.field_id,
					value: this.newDocField.value
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
				this.$emit('update-meta-data-data', "add", data.data);
			}
		},
	},
};
</script>
  
<style scoped></style>
  
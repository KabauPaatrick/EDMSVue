<template>
	<div class="x y">
		<!-- Content of Registered Cabinets -->
		<div class="card elevation-3">
			<div class="card-header">
				<h3 class="card-title"><b>Recently Viewed Folders and Documents</b></h3>
			</div>
			<div class="card-body table-responsive">
				<div class="row">
					<div class="col-md-9">
					</div>
					<div class="col-md-2 ml-3">
						<form class="form-group">
							<input v-model="searchTerm" placeholder="Search..." class="form-group rounded" />
						</form>
					</div>
				</div>
				<table class="table table-hover table-bordered">
					<thead class="thead-light">
						<tr>
							<th>#</th>
							<th @click="sortBy('name')">
								<i v-if="sortedColumn == 'name' && sortOrder == 'asc'">
									<span class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_up</span></i>
								<i v-else-if="sortedColumn == 'name' && sortOrder == 'desc'"><span
										class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_down</span></i>
								<i v-else><span class="material-symbols-outlined col-md-2 mr-1 pr-0 comparision_icon"
										style="border:none;">compare_arrows</span></i>
								Name
							</th>
							<th @click="sortBy('updated_at')">
								<i v-if="sortedColumn == 'updated_at' && sortOrder == 'asc'">
									<span class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_up</span></i>
								<i v-else-if="sortedColumn == 'updated_at' && sortOrder == 'desc'"><span
										class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_down</span></i>
								<i v-else><span class="material-symbols-outlined col-md-2 mr-1 pr-0 comparision_icon"
										style="border:none;">compare_arrows</span></i>
								Date Modified
							</th>
							<th @click="sortBy('path')">
								<i v-if="sortedColumn == 'path' && sortOrder == 'asc'">
									<span class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_up</span></i>
								<i v-else-if="sortedColumn == 'path' && sortOrder == 'desc'"><span
										class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_down</span></i>
								<i v-else><span class="material-symbols-outlined col-md-2 mr-1 pr-0 comparision_icon"
										style="border:none;">compare_arrows</span></i>
								path
							</th>
							<th @click="sortBy('size')">
								<i v-if="sortedColumn == 'size' && sortOrder == 'asc'">
									<span class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_up</span></i>
								<i v-else-if="sortedColumn == 'size' && sortOrder == 'desc'"><span
										class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_down</span></i>
								<i v-else><span class="material-symbols-outlined col-md-2 mr-1 pr-0 comparision_icon"
										style="border:none;">compare_arrows</span></i>
								Size
							</th>
							<!-- <th>Supervisor / Modified By</th> -->
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, id) in filteredRows" :key="id" :class="{ 'table-active': isActive == id }"
							@contextmenu.prevent="showContextMenu($event, item)">
							<td @click="openItem(item)">
								<span v-if="item.type == 'document'">
									<span v-if="bookmark_documents.includes(item.id)" class="material-symbols-outlined"
										style="font-size:30px;">book</span>
									<span class="material-symbols-outlined" v-else
										style="font-size:30px">insert_drive_file</span>
								</span>
								<span v-else>
									<span v-if="bookmark_folders.includes(item.id)" class="material-symbols-outlined"
										style="font-size:30px;">folder_special</span>
									<span class="material-symbols-outlined" v-else style="font-size:30px">folder</span>
								</span>
							</td>
							<td @click="highlistItem(item, id)">{{ item.name }}</td>
							<td @click="highlistItem(item, id)">{{ new Date(item.updated_at).toLocaleString() }}</td>
							<td @click="highlistItem(item, id)">{{ item.path }}</td>
							<td @click="highlistItem(item, id)">{{ item.size }} MB</td>
							<!-- <td>{{ item.created_at }}</td> -->
						</tr>
						<!-- Overlay to close the menu -->
						<div class="context_overlay" @click="closeContextMenu" v-if="showMenu" />

						<!-- Custom Context Menu -->
						<ContextMenu v-if="showMenu" :actions="contextMenuActions" @action-clicked="handleActionClick"
							:x="menuX" :y="menuY" />
					</tbody>
				</table>
			</div>
			<!-- <div class="card-footer clearfix">
        <ul class="pagination pagination-sm m-0 float-right">
          <li class="page-item"><a class="page-link" href="#" @click="fetchData(pagination.meta.current_page - 1)"
              :disabled="pagination.meta.current_page === 1">&laquo;</a></li>
          <li class="page-item"><a class="page-link" href="#" @click="fetchData(pagination.meta.current_page - 1)"
              :disabled="pagination.meta.current_page === 1">First</a></li>
          <span class="page-item page-link">Page {{ pagination.meta.current_page }} of {{ pagination.meta.total }}</span>
          <li class="page-item"><a class="page-link" href="#" @click="fetchData(pagination.meta.current_page - 1)"
              :disabled="pagination.meta.current_page === 1">Last</a></li>
          <li class="page-item"><a class="page-link" href="#" @click="fetchData(pagination.meta.current_page + 1)"
              :disabled="pagination.meta.current_page === pagination.meta.total">&raquo;</a></li>
        </ul>
      </div> -->
		</div>
	</div>
</template>
<script>
// import { inject } from 'vue'
import { ref } from 'vue';
import ContextMenu from '@/components/ContextMenu.vue';
import _ from 'lodash';

export default {
	components: {
		ContextMenu
	},
	props: {
		documents: Array,
		folders: Array,// Define the prop type
		pagination: Object,
	},
	data() {
		return {
			baseUrl: this.baseApiUrl,
			showMenu: ref(false),
			menuX: ref(0),
			menuY: ref(0),
			targetRow: ref({}),
			contextMenuActions: ref([
				{ label: 'Edit', action: 'edit' },
				{ label: 'Delete', action: 'delete' },
				{ label: 'Bookmark', action: 'bookmark' },
			]),
			isActive: null,
			searchTerm: '',
			sortedColumn: 'updated_at',
			sortOrder: 'asc',
			bookmark_documents: JSON.parse(localStorage.getItem("bookmark_documents")) || [],
			bookmark_folders: JSON.parse(localStorage.getItem("bookmark_folders")) || [],
		}
	},
	computed: {
		filteredRows() {
			let filteredRows = [];
			let documents = this.$props.documents;
			let folders = this.$props.folders;
			if (this.bookmark_folders.length || this.bookmark_documents.length) {
				documents.forEach(row => {
					row['name'] = row.document_name ? row.document_name : '';
					row['updated_at'] = row.document_versions.find(version => version.main_file == true) ?
						row.document_versions.find((version) => version.main_file == true).updated_at : row.updated_at;
					row['path'] = row.folder ? row.folder.path + '/' + row['name'] : '';
					row['size'] = row.document_versions.find(version => version.main_file == true) ?
						parseInt(row.document_versions.find(version => version.main_file == true).file_size).toFixed(4) :
						'';
					row['type'] = "document";
				});
				folders.forEach(row => {
					row['name'] = row.name ? row.name : '';
					row['updated_at'] = row.updated_at ? row.updated_at : '';
					row['path'] = row.path ? row.path : '';
					row['size'] = row.documents ? row.documents.length : '';
					row['type'] = "folder";
				});
				filteredRows = folders.concat(documents);
				if (this.searchTerm) {
					const searchTermLowerCase = this.searchTerm.toLowerCase();
					filteredRows = filteredRows.filter(row =>
						Object.values(row).some(value => value.toString().toLowerCase().includes(searchTermLowerCase))
					);
				}

				if (this.sortedColumn) {
					// const orderMultiplier = this.sortOrder === 'asc' ? 1 : -1;
					filteredRows = _.orderBy(filteredRows, [this.sortedColumn], [this.sortOrder]);
				}
			}
			return filteredRows;
		},
	},
	methods: {
		highlistItem(item, id) {
			this.isActive = id;
			if (item.type == 'document') {
				this.$emit('update-select-document', item);
			} else {
				this.$emit('update-current_folder', item);
			}
		},
		showContextMenu(event, item) {
			event.preventDefault();
			this.showMenu = true;
			this.targetRow = item;
			this.menuX = event.clientX - 130;
			this.menuY = event.clientY - 170;
		},
		closeContextMenu() {
			this.showMenu = false;
		},
		handleActionClick(action) {
			this.closeContextMenu();
			switch (action) {
				case "bookmark":
					if (this.targetRow.type == "document") {
						if (this.bookmark_documents.includes(parseInt(this.targetRow.id))) {
							this.bookmark_documents = this.bookmark_documents.filter(item => item != this.targetRow.id);   // Remove the document
							let target_doc = this.$props.documents.find(item => item.id == this.targetRow.id);
							this.$props.documents.splice(target_doc, 1);
						} else {
							this.bookmark_documents.push(this.targetRow.id);
						}
						localStorage.setItem("bookmark_documents", JSON.stringify(this.bookmark_documents));
					}
					else {
						if (this.bookmark_folders.includes(parseInt(this.targetRow.id))) {
							this.bookmark_folders = this.bookmark_folders.filter(item => item != this.targetRow.id);   // Remove the folder
							let target_folder = this.$props.folders.find(item => item.id == this.targetRow.id);
							this.$props.folders.splice(target_folder, 1);
						} else {
							this.bookmark_folders.push(this.targetRow.id);
						}
						localStorage.setItem("bookmark_folders", JSON.stringify(this.bookmark_folders));
					}
					break;
				// Add cases for other tabs
				default:
					break;
			}
		},
		sortBy(columnKey) {
			if (this.sortedColumn == columnKey) {
				this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
			} else {
				this.sortedColumn = columnKey;
				this.sortOrder = 'asc';
			}
		},
		openItem(item) {
			// console.log(item);
			if (item.type == 'folder') {
				this.$router.push({
					name: 'Repository',
					// params: { folder: item.id },
					query: { folder: item.id }
				});
			} else {
				let file_name = item.document_versions.find((version) => version.main_file == true).physical_path;
				let path = this.baseUrl + '/api/showPdf/' + file_name.split('/')[2];
				let showViewer = true;
				this.$emit('show-viewer', path, showViewer);
			}
			// this.$emit('open-folder', this.targetRow);
		}
	},
};
</script>
  
<style scoped>
.context_overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: transparent;
	z-index: 49;
}

.context_overlay::before {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
}

/* .context_overlay:hover {
  cursor: pointer;
} */
.comparision_icon {
	-webkit-transform: rotate(90deg);
	-moz-transform: rotate(90deg);
	-o-transform: rotate(90deg);
	-ms-transform: rotate(90deg);
	transform: rotate(90deg);
}
</style>
  
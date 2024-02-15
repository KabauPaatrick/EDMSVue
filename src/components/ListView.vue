<template>
	<div class="x y">
		<!-- Content of Registered Cabinets -->
		<div class="card elevation-3">
			<div class="card-header">
				<h3 class="card-title"><b>{{ folder ? folder.name : "" }}</b></h3>
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
							<th @click="sortBy('document_name')">
								<i v-if="sortedColumn == 'document_name' && sortOrder == 'asc'">
									<span class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_up</span></i>
								<i v-else-if="sortedColumn == 'document_name' && sortOrder == 'desc'"><span
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
							<th @click="sortBy('doc_version_name')">
								<i v-if="sortedColumn == 'doc_version_name' && sortOrder == 'asc'">
									<span class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_up</span></i>
								<i v-else-if="sortedColumn == 'doc_version_name' && sortOrder == 'desc'"><span
										class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_down</span></i>
								<i v-else><span class="material-symbols-outlined col-md-2 mr-1 pr-0 comparision_icon"
										style="border:none;">compare_arrows</span></i>
								Version
							</th>
							<th @click="sortBy('doc_file_size')">
								<i v-if="sortedColumn == 'doc_file_size' && sortOrder == 'asc'">
									<span class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_up</span></i>
								<i v-else-if="sortedColumn == 'doc_file_size' && sortOrder == 'desc'"><span
										class="material-symbols-outlined col-md-2 mr-1 pr-0"
										style="border:none;">arrow_drop_down</span></i>
								<i v-else><span class="material-symbols-outlined col-md-2 mr-1 pr-0 comparision_icon"
										style="border:none;">compare_arrows</span></i>
								Size (mbs)
							</th>
							<!-- <th>Supervisor / Modified By</th> -->
						</tr>
					</thead>
					<tbody>
						<tr v-for="(document, id) in filteredRows" :key="id"
							:class="{ 'table-active': isActive == document.id }"
							@contextmenu.prevent="showContextMenu($event, document)">
							<td>
								<span v-if="Array.isArray(bookmark_documents) && bookmark_documents.includes(document.id)" class="material-symbols-outlined"
									style="font-size:30px;">book</span>
								<span class="material-symbols-outlined" v-else
									style="font-size:30px">insert_drive_file</span>
							</td>
							<td @click="highlistItem(document, id)">{{ document.document_name }}</td>
							<td @click="highlistItem(document, id)">{{ new Date(document.updated_at).toLocaleString() }}
							</td>
							<td @click="highlistItem(document, id)">{{ document.doc_version_name }}</td>
							<td @click="highlistItem(document, id)">{{ document.doc_file_size }} MB</td>
							<!-- <td>{{ document.created_at }}</td> -->
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
		ContextMenu,
	},
	props: {
		documents: Array,
		folder: {},// Define the prop type
		pagination: Object,
	},
	data() {
		return {
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
		}
	},
	computed: {
		filteredRows() {
			let filteredRows = this.$props.documents;
			filteredRows.forEach(row => {
				row['updated_at'] = row.document_versions.find(version => version.main_file == true) ?
					row.document_versions.find((version) => version.main_file == true).updated_at : row.updated_at;
				row['doc_version_name'] = row.document_versions.find(version => version.main_file == true) ?
					row.document_versions.find(version => version.main_file == true).version_name : '';
				row['doc_file_size'] = row.document_versions.find(version => version.main_file == true) ?
					parseInt(row.document_versions.find(version => version.main_file == true).file_size).toFixed(4) :
					''
			});
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

			return filteredRows;
		},
	},
	methods: {
		openItem(item) {
			let path = this.baseUrl + '/api/showPdf/' + item.path.split('/')[2];
			let showViewer = true;
			this.$emit('show-viewer', path, showViewer);
		},
		highlistItem(document) {
			// console.log(document);
			this.isActive = document.id;
			this.$emit('update-select-document', document);
		},
		showContextMenu(event, document) {
			event.preventDefault();
			this.showMenu = true;
			this.targetRow = document;
			this.menuX = event.clientX - 430;
			this.menuY = event.clientY - 180;
		},
		closeContextMenu() {
			this.showMenu = false;
		},
		handleActionClick(action) {
			this.closeContextMenu();
			switch (action) {
				case "bookmark":
					// bookmarkly viewed folders
					if (this.bookmark_documents.includes(parseInt(this.targetRow.id))) {
						this.bookmark_documents = this.bookmark_documents.filter(item => item !== this.targetRow.id);   // Remove the ducment
					} else {
						this.bookmark_documents.push(this.targetRow.id);
					}
					localStorage.setItem("bookmark_documents", JSON.stringify(this.bookmark_documents));
					break;
				// Add cases for other tabs
				default:
					break;
				// console.log(action);
				// console.log(this.targetRow);
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
}</style>
  
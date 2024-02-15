<template>
	<div class="x y">
		<!-- Content of Registered Cabinets -->
		<div class="card elevation-3">
			<div class="card-header">
				<h3 class="card-title"><b>{{ current_folder ? current_folder.name : "" }}</b></h3>
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
				<div v-if="filteredRows && filteredRows.length" class="row">
					<div v-for="thumbnail in filteredRows" :key="thumbnail.id" class="column-md-3 thumbnail-container"
						@click="highlistItem(thumbnail, thumbnail.id)">
						<img :src="thumbnail.dataUrl" alt="Thumbnail" style="width: 150px; height: 200px; margin: 2px;"
							:class="{ 'thumbnail-active': isActive == thumbnail.id }"
							@contextmenu.prevent="showContextMenu($event, thumbnail)" />
						<span v-if="Array.isArray(bookmark_documents) && bookmark_documents.includes(thumbnail.id)" class="material-symbols-outlined corner-icon"
							style="font-size:20px;">stars</span>
						<center>
							<span>{{ thumbnail.document_name }}</span>
						</center>
						<center>
							<span>{{ thumbnail.size }} MB</span>
						</center>
						<center>
							<span>{{ thumbnail.updated_at }}</span>
						</center>
						<center>
							<span>Document Version: {{ thumbnail.version }}</span>
						</center>
					</div>
				</div>
				<!-- Overlay to close the menu -->
				<div class="context_overlay" @click="closeContextMenu" v-if="showMenu" />

				<!-- Custom Context Menu -->
				<ContextMenu v-if="showMenu" :actions="contextMenuActions" @action-clicked="handleActionClick" :x="menuX"
					:y="menuY" />
			</div>
			<div class="card-footer clearfix">
				<ul class="pagination pagination-sm m-0 float-right">
					<li class="page-item"><a class="page-link" href="#" @click="fetchData(pagination.meta.current_page - 1)"
							:disabled="pagination.meta.current_page === 1">&laquo;</a></li>
					<li class="page-item"><a class="page-link" href="#" @click="fetchData(pagination.meta.current_page - 1)"
							:disabled="pagination.meta.current_page === 1">First</a></li>
					<span class="page-item page-link">Page {{ pagination.meta.current_page }} of {{ pagination.meta.total
					}}</span>
					<li class="page-item"><a class="page-link" href="#" @click="fetchData(pagination.meta.current_page - 1)"
							:disabled="pagination.meta.current_page === 1">Last</a></li>
					<li class="page-item"><a class="page-link" href="#" @click="fetchData(pagination.meta.current_page + 1)"
							:disabled="pagination.meta.current_page === pagination.meta.total">&raquo;</a></li>
				</ul>
			</div>
		</div>
	</div>
	<EditDocument :editDocument="editDocument" v-if="showEditDocument" @close-modal="closeModalHandler" :folders="folders"
		@get-folder="refreshData" :current_folder="current_folder" />
</template>
  
<script>
// import { inject } from 'vue'
import { ref } from 'vue';
import * as pdfjsLib from '../../node_modules/pdfjs-dist/build/pdf';
import "vue3-pdf-app/dist/icons/main.css";
import EditDocument from '@/components/modals/EditDocument.vue';
import _ from 'lodash';

import ContextMenu from '@/components/ContextMenu.vue';

export default {
	components: {
		ContextMenu,
		EditDocument
	},
	props: {
		documents: Array,
		current_folder: {},// Define the prop type
		pagination: Object,
		folders: Array,
	},
	data() {
		return {
			baseUrl: this.baseApiUrl,
			token: localStorage.getItem("edms_token"),
			showMenu: ref(false),
			menuX: ref(0),
			menuY: ref(0),
			targetRow: ref({}),
			contextMenuActions: ref([
				{ label: 'Open', action: 'open' },
				{ label: 'Edit', action: 'edit' },
				{ label: 'Delete', action: 'delete' },
				{ label: 'Bookmark', action: 'bookmark' },
			]),
			isActive: null,
			searchTerm: '',
			sortedColumn: 'updated_at',
			sortOrder: 'asc',
			// bookmark_documents: JSON.parse(localStorage.getItem("bookmark_documents")) || [],
			bookmark_documents: [],
			thumbnails: [],
			editDocument: ref({}),
			showEditDocument: ref(false),
		}
	},
	watch: {
		'$props.documents': {
			immediate: true, // Execute the handler immediately after component is created
			handler(newDocuments) {
				this.$progress.start();
				this.thumbnails = [];
				newDocuments.forEach(document => {
					this.parseFile(document);
				});
				this.$progress.finish();
			},
		},
	},
	mounted() {
		this.bookmark_documents = this.fetchDocumentBookmarks();
	},
	computed: {
		filteredRows() {
			this.$progress.start();
			let filteredRows = this.thumbnails;
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

			this.$progress.finish();
			return filteredRows;
		},
	},
	methods: {
		async parseFile(target_document) {
			try {
				let file_name = target_document.document_versions.find((version) => version.main_file == true).physical_path;
				let path = this.baseUrl + '/api/showPdf/' + file_name.split('/')[2];
				const fetchResponse = await fetch(
					path, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${this.token}`,
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS'
					}
				});
				// Get the PDF file as an ArrayBuffer
				const pdfArrayBuffer = await fetchResponse.arrayBuffer();
				const pdfDoc = await pdfjsLib
					.getDocument({ data: new Uint8Array(pdfArrayBuffer) })
					.promise;
				const page = await pdfDoc.getPage(1);
				const viewport = page.getViewport({ scale: 1 });
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');

				canvas.width = viewport.width;
				canvas.height = viewport.height;

				const renderContext = { canvasContext: context, viewport: viewport };
				await page.render(renderContext).promise;

				const dataUrl = canvas.toDataURL('image/png');
				target_document["path"] = target_document.document_versions.find((version) => version.main_file == true).physical_path;
				target_document["dataUrl"] = dataUrl;
				target_document['updated_at'] = new Date(target_document.document_versions.find(version => version.main_file == true) ?
					target_document.document_versions.find((version) => version.main_file == true).updated_at : target_document.updated_at).toLocaleDateString();
				target_document["version"] = target_document.document_versions.find(version => version.main_file == true) ?
					target_document.document_versions.find(version => version.main_file == true).version_name : '';
				target_document["size"] = target_document.document_versions.find(version => version.main_file == true) ?
					parseInt(target_document.document_versions.find(version => version.main_file == true).file_size).toFixed(4) :
					'';
				this.thumbnails.push(target_document);
				// }
			} catch (ex) {
				console.log("Error in fetch");
				console.log(ex);
			}
		},
		openItem(item) {
			this.isActive = item.id;
			this.$emit('update-select-document', item);
			let path = this.baseUrl + '/api/showPdf/' + item.path.split('/')[2];
			let showViewer = true;
			this.$emit('show-viewer', path, showViewer);
		},
		highlistItem(document, index) {
			this.isActive = index;
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
				case "open":
					this.openItem(this.targetRow);
					break;
				case "bookmark":
					// bookmarkly viewed folders
					if (this.bookmark_documents.includes(parseInt(this.targetRow.id))) {
						this.postBookMarks(this.targetRow, 'document');
						this.bookmark_documents = this.bookmark_documents.filter(item => item !== this.targetRow.id);   // Remove the ducment
					} else {
						this.postBookMarks(this.targetRow, 'document');
						this.bookmark_documents.push(this.targetRow.id);
					}
					// localStorage.setItem("bookmark_documents", JSON.stringify(this.bookmark_documents));
					break;
				case "edit":
					this.editDocument = this.targetRow;
					this.showEditDocument = true;
					break;
				case "delete":
					this.$swal.fire({
						title: "Are you sure?",
						text: "Once deleted, you will not be able to recover this File and All It's Contents!",
						icon: "warning",
						showCancelButton: true,
						confirmButtonText: "Yes, delete it!",
						cancelButtonText: "No, cancel!",
						reverseButtons: true,
						showLoaderOnConfirm: true,
					})
						.then((result) => {
							if (result.isConfirmed) {
								fetch(this.baseUrl + '/api/folder/documents/delete/' + this.targetRow.id, {
									method: 'GET',
									headers: {
										'Authorization': `Bearer ${this.token}`,
										'Content-type': 'application/json'
									}
								}).then(response => response.json()).then(response_data => {
									if (response_data.data == 403) {
										// Use it!
										this.toast.error(response_data.message, {
											timeout: 5000
										});
									} else {
										// Use it!
										this.toast.success(response_data.message, {
											timeout: 5000
										});
										this.$emit('get-folder', this.targetRow.folder_id);
									}
								});
								// console.log(response);
								// const data = response.json();
							} else {
								this.toast.success("Folder is safe!", {
									timeout: 5000
								});
							}
						});
					break;
				// Add cases for other tabs
				default:
					break;
				// console.log(action);
				// console.log(this.targetRow);
			}

		},
		async postBookMarks(item, type) {
			const response = await fetch(this.baseUrl + '/api/bookmarks', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-type': 'application/json'
				},
				data: {
					item_id: item.id,
					type: type
				}
			});
			const data = await response.json();
			console.log(data);
		},
		sortBy(columnKey) {
			if (this.sortedColumn == columnKey) {
				this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
			} else {
				this.sortedColumn = columnKey;
				this.sortOrder = 'asc';
			}
		},
		closeModalHandler() {
			// Update the prop to close the modal
			this.showEditDocument = false;
		},
		refreshData(folder_id) {
			this.$emit('get-folder', folder_id);
		},
		fetchData(page) {
			this.$emit('get-folder', this.$props.current_folder.id, page);
		},
		async fetchDocumentBookmarks() {
			try {
				const response = await fetch(this.baseUrl + '/api/bookmarks', {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${this.token}`,
						'Content-type': 'application/json'
					}
				});
				const data = await response.json();
				let documents = data.filter(item => item.type == 'document');
				return documents.map(({ item_id }) => item_id);
			} catch (error) {
				console.error('Error fetching bookmarks:', error);
				// Handle errors gracefully
			}
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

.thumbnail-active {
	border: 1px solid gray;
}

/* Style for the icon */
.corner-icon {
	position: absolute;
	top: 0;
	/* Adjust top position */
	right: 0;
	/* Adjust right position */
	width: 30px;
	/* Adjust icon width */
	height: 30px;
	/* Adjust icon height */
	/* Add any additional styling as needed */
}

.thumbnail-container {
	position: relative;
	display: inline-block;
	/* Make sure it stays inline with the text */
}
</style>
  
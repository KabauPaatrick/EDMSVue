<template>
	<div class="x y">
		<!-- Content of Folders -->
		<div class="card elevation-3">
			<div class="card-header">
				<h3 class="card-title"><b>Recently Viewed Folders and Documents</b></h3>
			</div>
			<div class="card-body">
				<div v-if="filteredRows && filteredRows.length" class="row">
					<div v-for="(thumbnail, index) in filteredRows" :key="index" class="column-md-3 thumbnail-container"
						@contextmenu.prevent="showContextMenu($event, thumbnail)" @click="highlistItem(thumbnail, index)">
						<div v-if="thumbnail.type == 'document'">
							<img :src="thumbnail.dataUrl" alt="Thumbnail" style="width: 150px; height: 200px; margin: 2px;"
								:class="{ 'thumbnail-active': isActive == index }" />
							<span v-if="Array.isArray(bookmark_documents) && bookmark_documents.includes(thumbnail.id)"
								class="material-symbols-outlined corner-icon" style="font-size:20px;">stars</span>
						</div>
						<div v-else>
							<span v-if="Array.isArray(bookmark_folders) && bookmark_folders.includes(thumbnail.id)" class="material-symbols-outlined"
								style="font-size:200px;"
								:class="{ 'thumbnail-active': isActive == thumbnail.id }">folder_special</span>
							<span class="material-symbols-outlined" v-else style="font-size:200px"
								:class="{ 'thumbnail-active': isActive == thumbnail.id }">folder</span>
						</div>
						<center>
							<span>{{ thumbnail.name }}</span>
						</center>
						<center>
							<span>{{ thumbnail.size }} MB</span>
						</center>
						<center>
							<span>{{ new Date(thumbnail.updated_at).toLocaleString({
								dateStyle: 'short', timeStyle: 'short'
							}) }}</span>
						</center>
						<center v-if="thumbnail.type == 'document'">
							<span>Document Version: {{ thumbnail.version }}</span>
						</center>
					</div>
				</div>
				<div v-else>
					<p>No thumbnails available.</p>
				</div>
			</div>
			<!-- <div class="card-footer clearfix">
				<ul class="pagination pagination-sm m-0 float-right">
					<li class="page-item"><a class="page-link" href="#" @click="fetchData(currentPage - 1)"
							:disabled="currentPage === 1">&laquo;</a></li>
					<li class="page-item"><a class="page-link" href="#" @click="fetchData(currentPage - 1)"
							:disabled="currentPage === 1">First</a></li>
					<span class="page-item page-link">Page {{ pagination.meta.current_page }} of {{ pagination.meta.total
					}}</span>
					<li class="page-item"><a class="page-link" href="#" @click="fetchData(currentPage - 1)"
							:disabled="currentPage === 1">Last</a></li>
					<li class="page-item"><a class="page-link" href="#" @click="fetchData(currentPage + 1)"
							:disabled="currentPage === totalPages">&raquo;</a></li>
				</ul>
			</div> -->
		</div>
	</div>
	<!-- Overlay to close the menu -->
	<div class="context_overlay" @click="closeContextMenu" v-if="showMenu" />

	<!-- Custom Context Menu -->
	<ContextMenu v-if="showMenu" :actions="contextMenuActions" @action-clicked="handleActionClick" :x="menuX" :y="menuY" />
	<EditFolder :editFolder="editFolder" v-if="showEditFolder" @close-modal="closeModalHandler" :folders="folders"
		@get-folder="refreshData" />
	<EditDocument :editDocument="editDocument" v-if="showEditDocument" @close-modal="closeModalHandler" :folders="folders"
		@get-folder="refreshData" />
</template>
  
<script>
// import PdfThumbnail from '@/components/PdfThumbnail.vue';
import { ref } from 'vue';
import ContextMenu from '@/components/ContextMenu.vue';
import * as pdfjsLib from '../../node_modules/pdfjs-dist/build/pdf';
import "vue3-pdf-app/dist/icons/main.css";
import EditFolder from '@/components/modals/EditFolder.vue';
import EditDocument from '@/components/modals/EditDocument.vue';

export default {
	components: {
		ContextMenu,
		EditFolder,
		EditDocument
	},
	props: {
		documents: Array, // Define the prop type
		folders: Array,// Define the prop type
		pagination: Object,
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
			thumbnails: [],
			// bookmark_documents: JSON.parse(localStorage.getItem("bookmark_documents")) || [],
			bookmark_documents: [],
			// bookmark_folders: JSON.parse(localStorage.getItem("bookmark_folders")) || [],
			bookmark_folders: [],
			thumbnail: '',
			editFolder: ref({}),
			showEditFolder: ref(false),
			editDocument: ref({}),
			showEditDocument: ref(false),
		}
	},
	// mounted() {
	// 	this.thumbnails = [];
	// 	this.$props.documents.forEach(document => {
	// 		this.parseFile(document);
	// 	});
	// },  
	watch: {
		'$props.documents': {
			immediate: true, // Execute the handler immediately after component is created
			handler(newDocuments) {
				this.thumbnails = [];
				newDocuments.forEach(document => {
					this.parseFile(document);
				});
			},
		},
	},
	computed: {
		filteredRows() {
			let folders = this.$props.folders;
			folders.forEach(row => {
				row['name'] = row.name ? row.name : '';
				row['dataurl'] = null;
				row['type'] = "folder";
			});
			return this.thumbnails.concat(folders);
		}
	},
	mounted () {
			this.bookmark_documents = this.fetchDocumentBookmarks();
			this.bookmark_folders = this.fetchFolderBookmarks();
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
				target_document["name"] = target_document.document_name;
				target_document["path"] = target_document.document_versions.find((version) => version.main_file == true).physical_path;
				target_document["dataUrl"] = dataUrl;
				target_document["updated_at"] = target_document.document_versions.find(version => version.main_file == true) ?
					target_document.document_versions.find((version) => version.main_file == true).updated_at : target_document.updated_at;
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
			// console.log(item);
			if (item.type == 'folder') {
				this.$router.push({
					name: 'Repository',
					// params: { folder: item.id },
					query: { folder_id: item.id }
				});
			} else {
				let file_name = item.document_versions.find((version) => version.main_file == true).physical_path;
				let path = this.baseUrl + '/api/showPdf/' + file_name.split('/')[2];
				let showViewer = true;
				this.$emit('show-viewer', path, showViewer);
			}
			// this.$emit('open-folder', this.targetRow);
		},
		highlistItem(document, index) {
			this.isActive = index;
			if (document.type == 'document') {
				this.$emit('update-select-document', document);
			} else {
				this.$emit('update-current_folder', document);
			}
		},
		showContextMenu(event, item) {
			event.preventDefault();
			this.showMenu = true;
			this.targetRow = item;
			this.menuX = event.clientX;
			this.menuY = event.clientY;
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
					if (this.targetRow.type == "document") {
						if (this.bookmark_documents.includes(parseInt(this.targetRow.id))) {
							this.postBookMarks(this.targetRow, 'document');
							this.bookmark_documents = this.bookmark_documents.filter(item => item != this.targetRow.id);   // Remove the ducment
						} else {
							this.postBookMarks(this.targetRow, 'document');
							this.bookmark_documents.push(this.targetRow.id);
						}
						// localStorage.setItem("bookmark_documents", JSON.stringify(this.bookmark_documents));
					}
					else {
						if (this.bookmark_folders.includes(parseInt(this.targetRow.id))) {
							this.postBookMarks(this.targetRow, 'folder');
							this.bookmark_folders = this.bookmark_folders.filter(item => item != this.targetRow.id);   // Remove the folder
						} else {
							this.postBookMarks(this.targetRow, 'folder');
							this.bookmark_folders.push(this.targetRow.id);
						}
						// localStorage.setItem("bookmark_folders", JSON.stringify(this.bookmark_folders));
					}
					break;
				case "edit":
					if (this.targetRow.type == "folder") {
						this.editFolder = this.targetRow;
						this.showEditFolder = true;
					}
					else {
						this.editDocument = this.targetRow;
						this.showEditDocument = true;
						break;
					}
					break;
				case "delete":
					if (this.targetRow.type == "folder") {
						this.$swal.fire({
							title: "Are you sure?",
							text: "Once deleted, you will not be able to recover this Folder and All It's Contents!",
							icon: "warning",
							showCancelButton: true,
							confirmButtonText: "Yes, delete it!",
							cancelButtonText: "No, cancel!",
							reverseButtons: true,
							showLoaderOnConfirm: true,
						})
							.then((result) => {
								if (result.isConfirmed) {
									fetch(this.baseUrl + '/api/folders/delete/' + this.targetRow.id, {
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
											this.$emit('get-folder', this.targetRow.parent_folder_id);
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
					}
					else {
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
					}
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
		closeModalHandler() {
			// Update the prop to close the modal
			this.showEditFolder = false;
			this.showEditDocument = false;
		},
		refreshData(folder_id) {
			this.$emit('get-folder', folder_id);
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
		},
		async fetchFolderBookmarks() {
			try {
				const response = await fetch(this.baseUrl + '/api/bookmarks', {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${this.token}`,
						'Content-type': 'application/json'
					}
				});
				const data = await response.json();
				let folders = data.filter(item => item.type == 'folder');
				return folders.map(({ item_id }) => item_id);
			} catch (error) {
				console.error('Error fetching bookmarks:', error);
				// Handle errors gracefully
			}
		}
	}
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
  
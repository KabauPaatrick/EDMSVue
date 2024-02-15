<!-- eslint-disable vue/no-unused-components -->
<template>
	<!-- ... -->
	<div class="content" :style="{ width: openProperties ? '65vw' : auto }">
		<div class="container-fluid">
			<div class="content y">
				<div class="container-fluid px-5 py-2 bg-light rounded">
					<span v-for="path in current_folder_path" :key="path"> > {{ path }}</span>
				</div>
				<TopNav @show-list-view="showListView" @show-grid-view="showGridView" @show-properties="showProperties"
					@show-report="showReport" :folders="folders" @get-folder="refreshData" />

				<ListView :documents="documents" :pagination="pagination" :folders="folders" v-if="listview"
					@update-select-document="updateSelectDocument" @update-current_folder="updateCurrentFolder"
					@open-folder="$emit('open-folder', item)" @show-viewer="renderPdfViewer" @get-folder="refreshData" />

				<GridView :documents="documents" :pagination="pagination" :folders="folders" v-if="gridview"
					@open-folder="$emit('open-folder', item)" @show-viewer="renderPdfViewer"
					@update-current_folder="updateCurrentFolder" @update-select-document="updateSelectDocument"
					@get-folder="refreshData" />

				<DocumentViewer v-if="showViewer" :actual_file="actual_file" />
			</div>
		</div>
	</div>
	<PropertiesSideBar v-if="openProperties" :style="{ width: openProperties ? '25vw' : '0vw' }" @hide-sidebar="hideSidebar"
		:document="document" :current_folder="current_folder" @get-folder="refreshData" />
</template>
  

  
<script>
import ListView from "@/components/ListViewCombined.vue";
import GridView from "@/components/GridViewCombined.vue";
import TopNav from "@/components/TopNav.vue"
import PropertiesSideBar from "@/components/PropertiesSideBar.vue";
import DocumentViewer from '@/components/DocumentViewer.vue';

import { useToast } from "vue-toastification";
import { reactive } from 'vue';

export default {
	components: {
		ListView,
		GridView,
		TopNav,
		PropertiesSideBar,
		DocumentViewer
	},
	data() {
		return {
			toast: useToast(),
			baseUrl: this.baseApiUrl,
			token: localStorage.getItem("edms_token"),
			// recent_documents: JSON.parse(localStorage.getItem("recent_documents")) || [],
			recent_documents: [],
			// recent_folders: JSON.parse(localStorage.getItem("recent_folders")) || [],
			recent_folders: [],
			target_folder: reactive(0),
			listview: true,
			gridview: false,
			openProperties: false,
			documents: [],
			folders: [],
			document: {},
			actual_file: '',
			showViewer: false,
			pagination: {
				links: '',
				meta: ''
			}
		};
	},
	computed: {
		current_folder() {
			let current_folder = {};
			if (this.target_folder > 0) {
				current_folder = this.folders.find(folder => folder.id == this.target_folder) ? this.folders.find(folder => folder.id == this.target_folder) :
					{};
			}
			return current_folder;
		},
		current_folder_path() {
			return this.current_folder.path ? this.current_folder.path.split('/') : {};
		}
	},
	mounted() {
		this.recent_documents = this.fetchDocumentRecents();
		this.recent_folders = this.fetchFolderRecents();
		if (Array.isArray(this.recent_folders)) {
			this.recent_folders.forEach(folder => {
				this.getFolders(folder);
			});
		}
		if (Array.isArray(this.recent_documents)) {
			this.recent_documents.forEach(document => {
				this.getDocuments(document);
			});
		}
	},
	methods: {
		showGridView() {
			this.listview = false;
			this.gridview = true;
			this.openReport = false;
			this.showViewer = false;
		},
		showListView() {
			this.listview = true;
			this.gridview = false;
			this.openReport = false;
			this.showViewer = false;
		},
		showProperties() {
			this.openProperties = true;
		},
		hideSidebar() {
			this.openProperties = false;
		},
		async getFolders(target_folder) {
			this.$progress.start();

			const response = await fetch(this.baseUrl + '/api/folder/show/' + target_folder, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-type': 'application/json'
				}
			});
			const data = await response.json();
			if (data.success == false) {
				// Use it!
				this.toast.error(data.message, {
					timeout: 2000
				});
			} else {
				this.toast.success(data.message, {
					timeout: 2000
				});
				this.folders.push(data.data.data);
			}
			this.$progress.finish();

		},
		async getDocuments(target_document) {
			this.$progress.start();
			const response = await fetch(this.baseUrl + '/api/folder/document/show/' + target_document, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-type': 'application/json'
				}
			});
			const data = await response.json();
			// console.log(data);
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
				this.documents.push(data.data.data);
				this.pagination.links = data.data.links;
				this.pagination.meta = data.data.meta;
			}
			this.$progress.finish();
		},
		updateSelectDocument(document) {
			this.document = document;
			this.updateCurrentFolder(document.folder);
		},
		updateCurrentFolder(folder) {
			this.target_folder = folder.id;
		},
		renderPdfViewer(actual_file, showViewer) {
			this.actual_file = actual_file;
			this.showViewer = showViewer;
			this.listview = false;
			this.gridview = false;
			this.openReport = false;
		},
		refreshData() {
			this.folders = [];
			this.documents = [];
			this.recent_folders.forEach(folder => {
				this.getFolders(folder);
			});
			this.recent_documents.forEach(document => {
				this.getDocuments(document);
			});
		},
		async fetchDocumentRecents() {
			try {
				const response = await fetch(this.baseUrl + '/api/recent-views', {
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
				console.error('Error fetching Recents:', error);
				// Handle errors gracefully
			}
		},
		async fetchFolderRecents() {
			try {
				const response = await fetch(this.baseUrl + '/api/recent-views', {
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
				console.error('Error fetching Recents:', error);
				// Handle errors gracefully
			}
		}
	},
};
</script>
  
<style scoped></style>
  
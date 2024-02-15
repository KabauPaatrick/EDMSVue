<!-- eslint-disable vue/no-unused-components -->
<template>
	<!-- ... -->
	<!-- <div class="content" :style="{ width: openProperties ? '65vw' : '100vw' }"> -->
	<div class="content" :style="{ width: openProperties ? '75%' : '100%' }">
		<div class="container-fluid">
			<div class="content y">
				<div class="container-fluid px-5 py-2 bg-light rounded">
					<span v-for="path in current_folder_path" :key="path"> > {{ path }}</span>
				</div>
				<TopNav @show-list-view="showListView" @show-grid-view="showGridView" @show-properties="showProperties"
					@show-report="showReport" :folders="folders" @get-folder="refreshData"
					:current_folder="current_folder" />
				<div class="row ml-3">
					<FolderTree :folders="folders" :current_folder="current_folder" class="col-3" @get-folder="refreshData"
						v-if="!showViewer" />
					<!-- Direct usage of Grid and List View -->
					<div class="col-9">
						<ListView :current_folder="current_folder" :documents="documents" :pagination="pagination"
							v-bind:target_folder="target_folder" v-if="listview" :folders="folders"
							@update-select-document="updateSelectDocument" @show-viewer="renderPdfViewer"
							@get-folder="refreshData" />
						<GridView :current_folder="current_folder" :documents="documents" :pagination="pagination"
							v-bind:target_folder="target_folder" v-if="gridview" :folders="folders"
							@update-select-document="updateSelectDocument" @show-viewer="renderPdfViewer"
							@get-folder="refreshData" />
						<ReportView v-if="openReport" />
					</div>
				</div>
				<DocumentViewer v-if="showViewer" :actual_file="actual_file" class="ml-3 mr-5" />
			</div>
		</div>
	</div><!-- /.container-fluid -->
	<PropertiesSideBar v-if="openProperties" :style="{ width: openProperties ? '25%' : '0%' }" @hide-sidebar="hideSidebar"
		:document="document" :current_folder="current_folder" @get-folder="refreshData" />
</template>
  

  
<script>
import ListView from "@/components/ListView.vue";
import GridView from "@/components/GridView.vue";
import TopNav from "@/components/TopNav.vue";
import PropertiesSideBar from "@/components/PropertiesSideBar.vue";
import DocumentViewer from '@/components/DocumentViewer.vue';
import ReportView from "@/components/ReportView.vue";
import FolderTree from "@/components/FolderTree.vue";
import { useToast } from "vue-toastification";

export default {
	props: {
		folder_id: String,
	},
	components: {
		ListView,
		GridView,
		TopNav,
		PropertiesSideBar,
		ReportView,
		FolderTree,
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
			target_folder: this.$props.theTargetFolder ? this.$props.theTargetFolder : 1,
			// target_folder_parent_id: {},
			listview: true,
			gridview: false,
			openReport: false,
			openProperties: false,
			documents: [],
			folders: [],
			document: null,
			actual_file: '',
			showViewer: false,
			folder: {},
			pagination: {
				links: '',
				meta: ''
			}
		};
	},
	computed: {
		current_folder() {
			let current_folder = this.folder;
			return current_folder;
		},
		current_folder_path() {
			return this.current_folder.path ? this.current_folder.path.split("/") : "";
			// return current_folder_path.split("/");
		}
	},
	mounted() {
		this.target_folder = this.$route.query.folder_id ? this.$route.query.folder_id : 1;
		this.getFolders(this.target_folder);
		this.getDocuments(this.target_folder);
		this.recent_documents = this.fetchDocumentRecents();
		this.recent_folders = this.fetchFolderRecents();
	},
	methods: {
		showGridView() {
			this.listview = false;
			this.gridview = true;
			this.openReport = false;
			this.showViewer = false;
			this.openProperties = false;
		},
		showListView() {
			this.listview = true;
			this.gridview = false;
			this.openReport = false;
			this.showViewer = false;
			this.openProperties = false;
		},
		showProperties() {
			this.openProperties = true;
		},
		showReport() {
			this.listview = false;
			this.gridview = false;
			this.openReport = true;
			this.showViewer = false;
			this.openProperties = false;
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
			if (data.success == true) {
				this.toast.success(data.message, {
					timeout: 2000
				});
				this.folder = data.data.data;
				this.folders = this.folder.children.filter(child => child.id != child.parent_folder_id);
				// this.target_folder_parent_id = this.folder.parent.id;
			} else {
				// Use it!
				this.toast.error(data.message, {
					timeout: 2000
				});
			}

			// // recently viewed folders
			// if (this.recent_folders.length > 5) {
			// 	this.recent_folders.shift();  // Remove the folder
			// }
			if (Array.isArray(this.recent_folders) && !this.recent_folders.includes(parseInt(this.folder.id))) {
				this.postRecents(this.folder, 'folder');
				this.recent_folders.push(this.folder.id);  // Append the folder
			}
			// Update local storage with the modified array
			// localStorage.setItem("recent_folders", JSON.stringify(this.recent_folders));
			this.$progress.finish();

		},
		async getDocuments(target_folder, page) {
			this.documents = [];
			const response = await fetch(this.baseUrl + '/api/folder/' + target_folder + '/documents' + '?page=' + page, {
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
				this.documents = data.data.data;
				this.pagination.links = data.data.links;
				this.pagination.meta = data.data.meta;
			}
		},
		updateSelectDocument(document) {
			this.document = document;
			// // recently viewed folders
			// if (this.recent_documents.length > 5) {
			// 	this.recent_documents.shift();  // Remove the folder
			// }
			if (Array.isArray(this.recent_documents) && !this.recent_documents.includes(this.document.id)) {
				this.postRecents(this.document, 'document');
				this.recent_documents.push(this.document.id);  // Append the folder
			}

			// Update local storage with the modified array
			// localStorage.setItem("recent_documents", JSON.stringify(this.recent_documents));
		},
		getChildren(folder_id) {
			return this.folders.filter(x_folder => x_folder.parent_folder_id == folder_id && x_folder.id != folder_id);
		},
		refreshData(target_folder, page = 1) {
			// this.hideSidebar();
			this.document = null;
			this.target_folder = target_folder;
			this.getDocuments(target_folder, page);
			this.getFolders(target_folder);
		},
		renderPdfViewer(actual_file, showViewer) {
			this.actual_file = actual_file;
			this.showViewer = showViewer;
			this.listview = false;
			this.gridview = false;
			this.openReport = false;
		},
		async postRecents(item, type) {
			const response = await fetch(this.baseUrl + '/api/recent-views', {
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
  
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
				{{ folder }}
				<div class="row ml-0">
					<FolderTree :folders="folders" :target_folder_parent_id="target_folder_parent_id" class="col-3"
						@get-folder="refreshData" v-if="!showViewer" />
					<!-- Direct usage of Grid and List View -->
					<div class="col-9 ml-0">
						<ListView :folder="folders.find(folder => folder.id == target_folder)" :documents="documents"
							:pagination="pagination" v-bind:target_folder="target_folder" v-if="listview"
							@update-select-document="updateSelectDocument" @show-viewer="renderPdfViewer" />
						<GridView :folder="folders.find(folder => folder.id == target_folder)" :documents="documents"
							:pagination="pagination" v-bind:target_folder="target_folder" v-if="gridview"
							@update-select-document="updateSelectDocument" @show-viewer="renderPdfViewer" />
						<ReportView v-if="openReport" />
					</div>
				</div>
				<DocumentViewer v-if="showViewer" :actual_file="actual_file" />
			</div>
		</div>
	</div><!-- /.container-fluid -->
	<PropertiesSideBar v-if="openProperties" :style="{ width: openProperties ? '25vw' : '0vw' }" @hide-sidebar="hideSidebar"
		:document="document" :current_folder="current_folder"  @refresh-data="refreshData"/>
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
	// props: {
	// 	folder: String,
	// },
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
			recent_folders: JSON.parse(localStorage.getItem("recent_folders")) || [],
			recent_documents: JSON.parse(localStorage.getItem("recent_documents")) || [],
			target_folder: this.$props.theTargetFolder ? this.$props.theTargetFolder : 1,
			target_folder_parent_id: {},
			listview: true,
			gridview: false,
			openReport: false,
			openProperties: false,
			documents: [],
			folders: [],
			document: null,
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
			let current_folder = this.folders.find(folder => folder.id == this.target_folder) ? this.folders.find(folder => folder.id == this.target_folder) :
				{};
			return current_folder;
		},
		current_folder_path() {
			let current_folder_path = this.folders.find(folder => folder.id == this.target_folder) ? this.folders.find(folder => folder.id == this.target_folder).path : "";
			return current_folder_path.split("/");
		}
	},
	mounted() {
		this.target_folder = this.$route.query.folder ? this.$route.query.folder : 1;
		this.getFolders(this.target_folder);
		this.getDocuments(this.target_folder);
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
		showReport() {
			this.listview = false;
			this.gridview = false;
			this.openReport = true;
			this.showViewer = false;
		},
		hideSidebar() {
			this.openProperties = false;
		},
		async getFolders(target_folder) {
			this.$progress.start();

			const response = await fetch(this.baseUrl + '/api/folders/' + target_folder, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-type': 'application/json'
				}
			});
			const data = await response.json();
			if (data.data.data && data.data.data.length > 0) {
				this.toast.success(data.message, {
					timeout: 2000
				});
				this.folders = [];
				this.folders = data.data.data;
				this.folders.map(folder => {
					folder.children = this.getChildren(folder.id);
					return folder;
				});
				this.folders = this.folders.filter(folder => folder.id == target_folder);
				this.target_folder_parent_id = this.folders.find(folder => folder.id == target_folder).parent_folder_id;
				// console.log(this.target_folder_parent_id);
			} else {
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
					// console.log(data);
					if (data.data.data && Object.hasOwn(data.data.data, 'id')) {
						this.folders = [];
						this.folders.push(data.data.data);
						this.folders.forEach(folder => {
							this.target_folder_parent_id = folder.parent_folder_id;
						});
						this.folders.map(folder => {
							folder.children = this.getChildren(folder.id);
							return folder;
						});
						// console.log(this.target_folder_parent_id);
					}
				}
			}

			// recently viewed folders
			if (this.recent_folders.length > 5) {
				this.recent_folders.shift();  // Remove the folder
			}
			if (!this.recent_folders.includes(parseInt(target_folder))) {
				this.recent_folders.push(this.target_folder);  // Append the folder
			}
			// Update local storage with the modified array
			localStorage.setItem("recent_folders", JSON.stringify(this.recent_folders));
			this.$progress.finish();

		},
		async getDocuments(target_folder) {
			this.documents = [];
			const response = await fetch(this.baseUrl + '/api/folder/' + target_folder + '/documents', {
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
			// recently viewed folders
			if (this.recent_documents.length > 5) {
				this.recent_documents.shift();  // Remove the folder
			}
			if (!this.recent_documents.includes(this.document.id)) {
				this.recent_documents.push(this.document.id);  // Append the folder
			}

			// Update local storage with the modified array
			localStorage.setItem("recent_documents", JSON.stringify(this.recent_documents));
		},
		getChildren(folder_id) {
			return this.folders.filter(x_folder => x_folder.parent_folder_id == folder_id && x_folder.id != folder_id);
		},
		refreshData(target_folder) {
			// this.hideSidebar();
			this.target_folder = target_folder;
			this.getDocuments(target_folder);
			this.getFolders(target_folder);
		},
		renderPdfViewer(actual_file, showViewer) {
			this.actual_file = actual_file;
			this.showViewer = showViewer;
			this.listview = false;
			this.gridview = false;
			this.openReport = false;
		}
	},
};
</script>
  
<style scoped></style>
  
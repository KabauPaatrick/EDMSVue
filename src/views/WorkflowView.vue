<template>
    <div class="x y ml-5">
        <!-- Content of Registered Cabinets -->
        <div class="card elevation-3">
            <div class="card-header">
                <h3 class="card-title"><b>List of All Workflows</b></h3>
            </div>
            <div class="row mt-2">
                <div class="col-md-9">
                </div>
                <div class="col-md-2 ml-3">
                    <form class="form-workflow">
                        <input v-model="searchTerm" placeholder="Search..." class="form-workflow rounded" />
                    </form>
                </div>
            </div>

            <div id="accordion">
                <div class="card m-5" v-for="(workflow, index) in filteredRows" :key="index">
                    <div class="card-header row" :id="'heading' + index">
                        <div class="col-md-10">
                            <b>Start Folder: </b><span class="mr-5">{{ workflow.start_folder }}</span>
                            <b>End Folder: </b><span class="mr-5">{{ workflow.end_folder }}</span>
                            <b>Step Count: </b><span class="mr-5">{{ workflow.steps_count }}</span>
                            <b>Updated At: </b><span class="mr-5">{{ workflow.updated_at }}</span>
                        </div>
                        <h5 class="mb-0 col-md-2">
                            <button class="btn" data-toggle="collapse" :data-target="'#' + index" aria-expanded="false"
                                :aria-controls="index">
                                <span class="material-symbols-outlined col-md-2 mr-1 pr-0"
                                    style="border:none;">arrow_drop_down</span>
                            </button>
                        </h5>
                    </div>

                    <div :id="index" class="collapse" :aria-labelledby="'heading' + index" data-parent="#accordion">
                        <div class="card-body">
                            <div class="permissions-table">
                                <div id="inner_accordion">
                                    <div class="card m-2" v-for="(workstep, ind) in workflow" :key="ind">
                                        <div class="card-header row" :id="'heading_inner' + ind">
                                            <div class="col-md-10">
                                                <b>Folder: </b><span class="mr-5">{{ workstep.folder.name }}</span>
                                                <b>Workstep Type: </b><span class="mr-5">{{ workstep.workstep_type }}</span>
                                                <b>Activity: </b><span class="mr-5">{{ workstep.activity }}</span>
                                                <b>Description: </b><span class="mr-5">{{ workstep.description }}</span>
                                                <b>Updated At: </b><span class="mr-5">{{ workstep.updated_at }}</span>
                                            </div>
                                            <h5 class="mb-0 col-md-2">
                                                <button class="btn" data-toggle="collapse" :data-target="'#inner' + ind"
                                                    aria-expanded="false" :aria-controls="ind">
                                                    <span class="material-symbols-outlined col-md-2 mr-1 pr-0"
                                                        style="border:none;">arrow_drop_down</span>
                                                </button>
                                            </h5>
                                        </div>

                                        <div :id="'inner' + ind" class="collapse" :aria-labelledby="'heading_inner' + ind"
                                            data-parent="#inner_accordion">
                                            <div class="card-body">
                                                <div class="permissions-table">
                                                    <ul>
                                                        <li v-for="(action, index) in workstep.possible_actions" :key="index">
                                                            Name: {{ action.name }}
                                                            Description: {{ action.description }}
                                                            Next Workstep: {{ action.next_workstep.activity }}
                                                            updated_at: {{ action.updated_at }}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditDocument :editDocument="editDocument" v-if="showEditDocument" @close-modal="closeModalHandler"
                :folders="folders" @get-folder="refreshData" :current_folder="current_folder" />
            <!-- Overlay to close the menu -->
            <div class="context_overlay" @click="closeContextMenu" v-if="showMenu" />

            <!-- Custom Context Menu -->
            <ContextMenu v-if="showMenu" :actions="contextMenuActions" @action-clicked="handleActionClick" :x="menuX"
                :y="menuY" />
        </div>
    </div>
</template>

<script>
// import { inject } from 'vue'
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import ContextMenu from '@/components/ContextMenu.vue';
import EditDocument from '@/components/modals/EditDocument.vue';
import _ from 'lodash';

export default {
    components: {
        ContextMenu,
        EditDocument
    },
    data() {
        return {
            toast: useToast(),
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
                // { label: 'Bookmark', action: 'bookmark' },
            ]),
            isActive: null,
            searchTerm: '',
            sortedColumn: 'start_folder',
            sortOrder: 'asc',
            workflows: [],
            editWorkflow: ref({}),
            showEditWorkflow: ref(false),
        }
    },
    computed: {
        filteredRows() {
            let filteredRows = this.workflows;
            filteredRows.forEach(workflow => {
                workflow["start_folder"] = workflow.find(step => step.previous == 0).folder.name;
                workflow["end_folder"] = workflow.find(step => step.is_last == 1).folder.name;
                workflow["steps_count"] = workflow.length;
                workflow["updated_at"] = new Date(workflow.sort((a, b) => a.updated_at - b.updated_at)[workflow.length - 1].updated_at).toLocaleString();
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
    mounted() {
        this.fetchWorkflows();
    },
    methods: {
        openItem(item) {
            let path = this.baseUrl + '/api/showPdf/' + item.document_versions.find((version) => version.main_file == true).physical_path.split('/')[2];
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
        async handleActionClick(action) {
            this.closeContextMenu();
            switch (action) {
                case "open":
                    this.isActive = this.targetRow.id;
                    this.$emit('update-select-document', this.targetRow);
                    this.openItem(this.targetRow);
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
                                fetch(this.baseUrl + '/api/folder/workflows/delete/' + this.targetRow.id, {
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
            this.$emit('get-folder', folder_id,);
        },
        fetchData(page) {
            this.$emit('get-folder', this.$props.current_folder.id, page);
        },
        async fetchWorkflows() {
            try {
                const response = await fetch(this.baseUrl + '/api/workflows', {
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
                    // Use it!
                    this.toast.success(data.message, {
                        timeout: 2000
                    });
                    // this.pagination.links = data.data.links;
                    // this.pagination.meta = data.data.meta;
                    this.workflows = data.data.data;
                    // console.log(this.workflows);
                }
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
</style>

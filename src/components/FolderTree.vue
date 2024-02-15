<template>
    <div class="card elevation-3 p-0">
        <div class="card-header">
            <h3 class="card-title"><b>Folder Tree</b></h3>
        </div>
        <div class="card-body pl-1">
            <div class="tree">
                <ul class="pl-0 ml-0">
                    <span style="color:#000; text-decoration:none;" data-toggle="collapse" href="#back" class="x y nav"
                          aria-expanded="false" aria-controls="back"
                          @click="$emit('get-folder', current_folder.parent.id)">
                        <i class="collapsed"><span class="material-symbols-outlined">first_page</span></i>
                        <span style="border:none">&nbsp;Back</span>
                    </span>
                    <!-- <li v-for="folder in folders" :key="folder.id"> -->
                    <li v-if="current_folder.name">
                        <span style="color:#000; text-decoration:none;" data-toggle="collapse"
                              href="#{{ current_folder.name }}" aria-expanded="true"
                              aria-controls="{{ current_folder.name }}"
                              class="row ml-1" @contextmenu.prevent="showContextMenu($event, current_folder)">
                            <i class="collapsed"><span class="material-symbols-outlined col-md-2"
                                                       style="border:none;">folder</span></i>
                            <i class="expanded"><span class="material-symbols-outlined col-md-2"
                                                      style="border:none;">folder_open</span></i>
                            <span style="border:none" class=" col-md-7 ml-0 pl-0">
                                {{ current_folder.name }}
                                <span v-if="Array.isArray(bookmark_folders) && bookmark_folders.includes(current_folder.id)"
                                      class="material-symbols-outlined"
                                      style="font-size:15px; border: none">stars</span>
                            </span>
                        </span>
                        <div id="{{ current_folder.name }}" class="collapse show" v-if="folders && folders.length">
                            <ul>
                                <li v-for="folder in folders" :key="folder.id"
                                    @contextmenu.prevent="showContextMenu($event, folder)">
                                    <span style="color:#000; text-decoration:none; " data-toggle="collapse"
                                          href="#{{ folder.name }}" aria-expanded="false"
                                          aria-controls="{{ folder.name }}"
                                          @click="expandTree($event, folder.id)" class="row">
                                        <!-- @click="$emit('get-folder', folder.id)"> -->
                                        <i class="collapsed">
                                            <span v-if="Array.isArray(bookmark_folders) && bookmark_folders.includes(folder.id)"
                                                  class="material-symbols-outlined col-md-2"
                                                  style="font-size:30px;border:none;">folder_special</span>
                                            <span v-else class="material-symbols-outlined col-md-2"
                                                  style="font-size:30px;border:none;">folder</span>
                                        </i>
                                        <span style="border:none" class="col-md-7 ml-0 pl-0">{{ folder.name }}</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!-- Overlay to close the menu -->
    <div class="context_overlay" @click="closeContextMenu" v-if="showMenu"/>

    <!-- Custom Context Menu -->
    <ContextMenu v-if="showMenu" :actions="contextMenuActions" @action-clicked="handleActionClick" :x="menuX"
                 :y="menuY"/>
    <EditFolder :editFolder="editFolder" v-if="showEditFolder" @close-modal="closeModalHandler" :folders="folders"
                @get-folder="refreshData" :current_folder="current_folder"/>
</template>
<script>
import {ref} from 'vue';
import {useToast} from "vue-toastification";
import ContextMenu from '@/components/ContextMenu.vue';
import EditFolder from '@/components/modals/EditFolder.vue';

export default {
    components: {
        ContextMenu,
        EditFolder
    },
    props: {
        folders: {
            type: Array,
            required: true,
        },
        current_folder: {
            type: Object,
            required: true
        },
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
                {label: 'Edit', action: 'edit'},
                {label: 'Delete', action: 'delete'},
                {label: 'Bookmark', action: 'bookmark'},
            ]),
            // bookmark_folders: JSON.parse(localStorage.getItem("bookmark_folders")) || [],
            bookmark_folders: [],
            editFolder: ref({}),
            showEditFolder: ref(false),
        }
    },
    mounted() {
        this.bookmark_folders = this.fetchFolderBookmarks();
    },
    methods: {
        expandTree(event, id) {
            // console.log(id);
            this.$emit('get-folder', id);
            // if (!event.target.getAttribute('aria-expanded')) {
            //     this.$emit('get-folder', id)
            // }
        },
        showContextMenu(event, folder) {
            if (folder.id != 1) {
                event.preventDefault();
                this.showMenu = true;
                this.targetRow = folder;
                this.menuX = event.clientX;
                this.menuY = event.clientY;
            }
        },
        closeContextMenu() {
            this.showMenu = false;
        },
        async handleActionClick(action) {
            this.closeContextMenu();
            switch (action) {
                case "bookmark":
                    // bookmarkly viewed folders
                    if (Array.isArray(this.bookmark_folders) && this.bookmark_folders.includes(parseInt(this.targetRow.id))) {
                        this.bookmark_folders = this.bookmark_folders.filter(item => item != this.targetRow.id);   // Remove the folder
                        let target_folder = this.$props.folders.find(item => item.id == this.targetRow.id);
                        this.$props.folders.splice(target_folder, 1);
                        this.postBookMarks(this.targetRow, 'folder');
                    } else {
                        this.postBookMarks(this.targetRow, 'folder');
                        this.bookmark_folders.push(this.targetRow.id);
                    }
                    break;
                case "edit":
                    this.editFolder = this.targetRow;
                    this.showEditFolder = true;
                    break;
                case "delete":
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
                    break;
                // Add cases for other tabs
                default:
                    break;
                // console.log(action);
                // console.log(this.targetRow);
            }
        },
        closeModalHandler() {
            // Update the prop to close the modal
            this.showEditFolder = false;
        },
        refreshData(target_folder) {
            this.$emit('get-folder', target_folder);
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
                return folders.map(({item_id}) => item_id);
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
                // Handle errors gracefully
            }
        }
    }
};
</script>
<style scoped>
.tree li {
    list-style-type: none;
    margin: 0;
    padding: 10px 5px 0 5px;
    position: relative
}

.tree li::before,
.tree li::after {
    content: '';
    left: -20px;
    position: absolute;
    right: auto
}

.tree li::before {
    border-left: 2px solid #000;
    bottom: 50px;
    height: 100%;
    top: 0;
    width: 1px
}

.tree li::after {
    border-top: 2px solid #000;
    height: 20px;
    top: 25px;
    width: 25px
}

.tree li span {

    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border: 2px solid #000;
    border-radius: 3px;
    display: flex;
    padding: 3px 8px;
    text-decoration: none;
    cursor: pointer;
}

.tree > ul > li::before,
.tree > ul > li::after {
    border: 0
}

.tree li:last-child::before {
    height: 27px
}

.tree li span:hover {
    background: #5e7449;
    color: white;
    /* border: 2px solid #94a0b4; */
}

[aria-expanded="false"] > .expanded,
[aria-expanded="true"] > .collapsed {
    display: none;
}

li:hover {
    background-color: white;
    /* Change the background color on hover */
    border-bottom: none !important;
    /* Add a gray bottom border on hover */
    color: gray;
    /* Change the text color on hover */
}

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
</style>

<template>
    <div class="card elevation-3 p-0">
        <div class="card-header">
            <h3 class="card-title"><b>Folder Tree</b></h3>
        </div>
        <div class="card-body pl-1">
            <div class="tree">
                <ul class="pl-0 ml-0">
                    <span style="color:#000; text-decoration:none;" data-toggle="collapse" href="#back" class="x y nav"
                        aria-expanded="false" aria-controls="back" @click="$emit('get-folder', target_folder_parent_id)">
                        <i class="collapsed"><span class="material-symbols-outlined">first_page</span></i>
                        <span style="border:none">&nbsp;Back</span>
                    </span>
                    <li v-for="folder in folders" :key="folder.id">
                        <span style="color:#000; text-decoration:none;" data-toggle="collapse" href="#{{ folder.name }}"
                            aria-expanded="true" aria-controls="{{ folder.name }}" class="row ml-1"
                            @contextmenu.prevent="showContextMenu($event, folder)">
                            <i class="collapsed"><span class="material-symbols-outlined col-md-2 mr-1 pr-0"
                                    style="border:none;">folder</span></i>
                            <i class="expanded"><span class="material-symbols-outlined col-md-2 mr-1 pr-0"
                                    style="border:none;">folder_open</span></i>
                            <span style="border:none" class=" col-md-7 ml-0 pl-0">{{ folder.name }}</span>
                        </span>
                        <div id="{{ folder.name }}" class="collapse show" v-if="folder.children && folder.children.length">
                            <ul>
                                <li v-for="child in folder.children" :key="child.id"
                                    @contextmenu.prevent="showContextMenu($event, child)">
                                    <span style="color:#000; text-decoration:none; " data-toggle="collapse"
                                        href="#{{ child.name }}" aria-expanded="false" aria-controls="{{ child.name }}"
                                        @click="expandTree($event, child.id)" class="row">
                                        <!-- @click="$emit('get-folder', child.id)"> -->
                                        <i class="collapsed">
                                            <span v-if="bookmark_folders.includes(child.id)"
                                                class="material-symbols-outlined col-md-2 mr-1 pr-0"
                                                style="font-size:30px;border:none;">folder_special</span>
                                            <span v-else class="material-symbols-outlined col-md-2 mr-1 pr-0"
                                                style="font-size:30px;border:none;">folder</span>
                                        </i>
                                        <span style="border:none" class="col-md-7 ml-0 pl-0">{{ child.name }}</span>
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
    <div class="context_overlay" @click="closeContextMenu" v-if="showMenu" />

    <!-- Custom Context Menu -->
    <ContextMenu v-if="showMenu" :actions="contextMenuActions" @action-clicked="handleActionClick" :x="menuX" :y="menuY" />
</template>
<script>
import { ref } from 'vue';
import ContextMenu from '@/components/ContextMenu.vue';

export default {
    components: {
        ContextMenu
    },
    props: {
        folders: {
            type: Array,
            required: true,
        },
        target_folder_parent_id: {
            type: String,
            required: true
        },
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
            bookmark_folders: JSON.parse(localStorage.getItem("bookmark_folders")) || [],
        }
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
            event.preventDefault();
            this.showMenu = true;
            this.targetRow = folder;
            this.menuX = event.clientX;
            this.menuY = event.clientY;
        },
        closeContextMenu() {
            this.showMenu = false;
        },
        handleActionClick(action) {
            this.closeContextMenu();
            switch (action) {
                case "bookmark":
                    // bookmarkly viewed folders
					if (this.targetRow.type == "document") {
						if (this.bookmark_documents.includes(parseInt(this.targetRow.id))) {
							this.bookmark_documents = this.bookmark_documents.filter(item => item != this.targetRow.id);   // Remove the ducment
						} else {
							this.bookmark_documents.push(this.targetRow.id);
						}
						localStorage.setItem("bookmark_documents", JSON.stringify(this.bookmark_documents));
					}
					else {
						if (this.bookmark_folders.includes(parseInt(this.targetRow.id))) {
							this.bookmark_folders = this.bookmark_folders.filter(item => item != this.targetRow.id);   // Remove the folder
						} else {
							this.bookmark_folders.push(this.targetRow.id);
						}
						localStorage.setItem("bookmark_folders", JSON.stringify(this.bookmark_folders));
					}
                    break;
                // Add cases for other tabs
                default:
                    break;
                // console.log(action);
                // console.log(this.targetRow);
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

.tree>ul>li::before,
.tree>ul>li::after {
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

[aria-expanded="false"]>.expanded,
[aria-expanded="true"]>.collapsed {
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
<template>
    <div id="myModal" class="modalIn">
        <div class="modalIn-content">
            <span class="close" @click="closeModal()">&times;</span>
            <h2 id="modalTitle" class="modalIn-title"></h2>
            <!--------------------------------------------------------------------CREATE NEW UPLOAD FILE-------------------------------------------------------------------->
            <form v-on:submit.prevent="editFolderFunc">
                    <div class="form-group">
                        <!-- <input type="text" hidden id="folder_name" aria-describedby="folder_name" v-model="targetFolder.id" required> -->
                        <label for="cabinet_id">Select Parent:</label>
                        <select class="form-control" id="selected_cabinet1" name="cabinet_id" required v-model="targetFolder.parent_folder_id">
                            <option disabled value="null">Select Parent</option>
                            <option v-for="folder in folders.concat(folders[0].children)" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="folder_name">Folder Name:</label>
                        <input type="text" class="form-control" id="folder_name" aria-describedby="folder_name"
                            placeholder="Enter Folder Name" v-model="targetFolder.name" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Folder</button>
                </form>
            <!--------------------------------------------------------------------EDIT CABINET CONTENT-------------------------------------------------------------------->
        </div>
    </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
    props: {
        editFolder: {},
        folders: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            targetFolder: this.$props.editFolder,
            toast: useToast(),
            baseUrl: this.baseApiUrl,
            token: localStorage.getItem("edms_token"),
            activeTab: 0,
            cabinet_id: null,
            folder_id: null,
            version_name: null,
            cabinet_name: '',
            folder_name: '',
            document_name: '',
            document: null,
            showEditModal:false,
        };
    },
    computed: {
        nested_folders() {
            let nested = [];
            this.$props.folders.forEach(folder => {
                // Check if 'children' property exists before pushing
                if (folder.children && Array.isArray(folder.children)) {
                    nested.push(...folder.children);
                }
            });
            console.log(this.$props.folders);
            return nested;
        }
    },

    methods: {
        async editFolderFunc() {
            const response = await fetch(this.baseUrl + '/api/folders/update/' + this.targetFolder.id, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    parent_folder_id: this.targetFolder.id,
                    name: this.targetFolder.name
                })
            });
            const data = await response.json();
            if (data.data == 403) {
                // Use it!
                this.toast.error(data.message, {
                    timeout: 5000
                });
            } else {
                // Use it!
                this.toast.success(data.message, {
                    timeout: 5000
                });
                this.$emit('get-folder', data.data.data.parent_folder_id);
            }
            this.closeModal();
            this.$emit('close-modal');

        },
        closeModal() {
            // Emit an event to inform the parent component to close the modal
            this.$emit('close-modal');
        }
    },
};

</script>

<style scoped>
.tab {
    cursor: pointer;
    padding: 10px;
}

.tab.active {
    background-color: #355B11;
    color: white;
}
</style>
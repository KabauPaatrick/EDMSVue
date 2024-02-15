<template>
    <div id="myModal" class="modalIn">
        <div class="modalIn-content">
            <span class="close" @click="closeModal()">&times;</span>
            <h2 id="modalTitle" class="modalIn-title"></h2>
            <!--------------------------------------------------------------------CREATE NEW UPLOAD FILE-------------------------------------------------------------------->
            <form v-on:submit.prevent="editDocumentFunc">
                <div class="form-group">
                    <!-- <input type="text" hidden id="folder_name" aria-describedby="folder_name" v-model="targetFolder.id" required> -->
                    <label for="cabinet_id">Select Folder:</label>
                    <!-- <select class="form-control" id="selected_cabinet1" name="cabinet_id" required
                        v-model="this.$props.editDocument.folder_id">
                        <option disabled value="null">Select Parent</option>
                        <option v-for="folder in folders.concat(editDocument.folder)" :key="folder.id" :value="folder.id">{{
                            folder.name }}</option>
                    </select>
                     -->
                    <select v-if="current_folder != null"  class="form-control" id="selected_cabinet1" name="cabinet_id" required
                        v-model="this.$props.editDocument.folder_id">
                        <option disabled value="null">Select Parent</option>
                        <option v-for="folder in folders.concat(current_folder.parent, editDocument.folder)"
                            :key="folder.id" :value="folder.id">{{ folder.name }}</option>
                    </select>
                    <select v-else  class="form-control" id="selected_cabinet1" name="cabinet_id" required
                        v-model="this.$props.editDocument.folder_id">
                        <option disabled value="null">Select Parent</option>
                        <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{
                            folder.name }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="version_name">Version:</label>
                    <input type="text" class="form-control" id="version_name" aria-describedby="version_name"
                        placeholder="Enter Starting Version" v-model="this.$props.editDocument.document_versions.find(version => version.main_file == true).version_name" required>
                </div>
                <div class="form-group">
                    <label for="document_name">Document Name:</label>
                    <input type="text" class="form-control" id="document_name" aria-describedby="document_name"
                        placeholder="Type Document Name" v-model="this.$props.editDocument.document_name" required>
                </div>
                <div class="form-group">
                    <!-- File input for multiple file uploads -->
                    <label for="document">Select File:</label>
                    <input type="file" ref="document" name="document" @change="handleFileChange" accept="application/pdf">
                </div>
                <button type="submit" class="btn btn-primary">Update Document</button>
            </form>
            <!--------------------------------------------------------------------EDIT CABINET CONTENT-------------------------------------------------------------------->
        </div>
    </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
    props: {
		current_folder: {},
        editDocument: {},
        folders: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            toast: useToast(),
            baseUrl: this.baseApiUrl,
            token: localStorage.getItem("edms_token"),
            document: null,
            version: this.document_version,
            showEditModal: false,
        };
    },
    // mounted() {
    //     this.version = this.$props.editDocument.document_versions ? this.$props.editDocument.document_versions.find(version => version.main_file == true).version_name : null;
    // },
    methods: {
        async editDocumentFunc() {
            let formData = new FormData();
            formData.append('folder_id', this.$props.editDocument.folder_id);
            // formData.append('version_name', parseFloat(this.version));
            formData.append('version_name', parseFloat(this.$props.editDocument.document_versions.find(version => version.main_file == true).version_name));
            formData.append('document_name', this.$props.editDocument.document_name);
            formData.append('document', this.$refs.document.files[0]);
            const response = await fetch(this.baseUrl + '/api/folder/documents/re-upload/' + this.$props.editDocument.id, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,

                },
                body: formData
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            // console.log(data);
            if (data.success == false) {
                // Use it!
                this.toast.error(data.message, {
                    timeout: 5000
                });
                if (data.message == "Validation Error.") {
                    let errors = data.data;
                    for (const key in errors) {
                        if (Object.hasOwnProperty.call(errors, key)) {
                            const errorMessages = errors[key];

                            // Loop through each error message in the array
                            errorMessages.forEach(errorMessage => {
                                // Show a toast notification for each error message
                                this.toast.error(`${key}: ${errorMessage}`, {
                                    timeout: 5000
                                });
                            });
                        }
                    }
                }
            } else {
                // Use it!
                this.toast.success(data.message, {
                    timeout: 5000
                });
                // this.$props.editDocument = data.data.data;
                this.$emit('get-folder', data.data.data.folder_id);
            }
            this.closeModal();

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
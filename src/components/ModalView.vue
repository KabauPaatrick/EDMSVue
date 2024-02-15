<template>
    <div id="myModal" class="modalIn" v-if="targetModal != ''">
        <div class="modalIn-content">
            <span class="close" @click="closeModal()">&times;</span>
            <h2 id="modalTitle" class="modalIn-title">{{ targetModal }}</h2>
            <!-- Add content for "New" modal here -->
            <!--------------------------------------------------------------------CREATE NEW CABINET CONTENT-------------------------------------------------------------------->
            <div class="content y" style="padding:2%;" id="createCabinetModal" v-if="targetModal === 'New Cabinet'">
                <form v-on:submit.prevent="addCabinet">
                    <div class="form-group">
                        <label for="cabinet_name">Cabinet Name:</label>
                        <input type="text" class="form-control" id="cabinet_name" aria-describedby="cabinet_name"
                            placeholder="Enter Cabinet Name" v-model="cabinet_name" required>
                    </div>
                    <!-- <div class="form-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="gridCheck1">
                                <label class="form-check-label" for="gridCheck1">
                                    Assign Group
                                </label>
                        </div>
                    </div> -->
                    <button type="submit" class="btn btn-primary">Create Cabinet</button>
                </form>
            </div>
            <!--------------------------------------------------------------------CREATE NEW CABINET CONTENT-------------------------------------------------------------------->

            <!--------------------------------------------------------------------CREATE NEW FOLDER CONTENT-------------------------------------------------------------------->
            <div class="content y" style="padding:2%;" id="createFoldertModal" v-if="targetModal === 'New Folder'">

                <form v-on:submit.prevent="addFolder">
                    <div class="form-group">
                        <label for="cabinet_id">Select Cabinet:</label>
                        <select class="form-control" id="selected_cabinet1" name="cabinet_id" required v-model="cabinet_id">
                            <option disabled value="null">Select Cabinet</option>
                            <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="folder_name">Folder Name:</label>
                        <input type="text" class="form-control" id="folder_name" aria-describedby="folder_name"
                            placeholder="Enter Folder Name" v-model="folder_name" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Create Folder</button>
                </form>
            </div>
            <!--------------------------------------------------------------------CREATE NEW CABINET CONTENT-------------------------------------------------------------------->

            <!--------------------------------------------------------------------CREATE NEW UPLOAD FILE-------------------------------------------------------------------->
            <div class="content y" style="padding:2%;" id="uploadDocumetstModal"
                v-if="targetModal === 'Upload Document(s) From Computer'">
                <form v-on:submit.prevent="uploadDocuments">
                    <div class="form-group">
                        <label for="version_name">Version:</label>
                        <input type="text" class="form-control" id="version_name" aria-describedby="version_name"
                            placeholder="Enter Starting Version" v-model="version_name" required>
                    </div>
                    <div class="form-group">
                        <label for="document_name">Document Name:</label>
                        <input type="text" class="form-control" id="document_name" aria-describedby="document_name"
                            placeholder="Type Document Name" v-model="document_name" required>
                    </div>
                    <div class="form-group">
                        <!-- File input for multiple file uploads -->
                        <label for="document">Select File (s):</label>
                        <input type="file" ref="document" name="document"
                            accept=".pdf, .jpeg, .jpg, .png, .doc, .docx, .xls, .xlsx, .csv, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            multiple required>
                    </div>
                    <div class="form-group">
                        <!-- File input for multiple file uploads -->
                        <label for="document">Or Scan:</label>

                        <center>
                            <span class="material-symbols-outlined"
                                style="font-size:30px">scanner</span>
                                <br>Promp Scanning
                        </center>
                    </div>


                    <button type="submit" name="uploadDocuments" class="btn btn-primary">Upload Files</button>
                </form>
            </div>
            <!--------------------------------------------------------------------CREATE NEW CABINET CONTENT-------------------------------------------------------------------->


        </div>
    </div>
</template>

<script>

import { useToast } from "vue-toastification";

export default {
    props: {
        current_folder: {},
        targetModal: String, // Define the prop type
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
            activeTab: 0,
            cabinet_id: null,
            folder_id: null,
            version_name: null,
            cabinet_name: '',
            folder_name: '',
            document_name: '',
            document: null,
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
        async addCabinet() {
            const response = await fetch(this.baseUrl + '/api/folders/store', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    parent_folder_id: 1,
                    name: this.cabinet_name
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

            //     this.$swal(data);
        },
        async addFolder() {
            const response = await fetch(this.baseUrl + '/api/folders/store', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    parent_folder_id: this.cabinet_id,
                    name: this.folder_name
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

            //     this.$swal(data);
        },
        async uploadDocuments() {
            for (const file of this.$refs.document.files) {
                let formData = new FormData();
                formData.append('folder_id', this.$props.current_folder.id);
                formData.append('version_name', this.version_name);
                formData.append('document_name', this.document_name);
                formData.append('document', file);
                const response = await fetch(this.baseUrl + '/api/folder/documents/upload', {
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
                console.log(data);
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
                    // console.log(data.data.data);
                    this.$emit('get-folder', data.data.data.folder_id);
                }
            }
            this.closeModal();

            //     this.$swal(data);
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
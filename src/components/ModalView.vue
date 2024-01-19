<template>
    <div id="myModal" class="modalIn" v-if="targetModal != ''">
        <div class="modalIn-content">
            <span class="close" @click="closeModal()">&times;</span>
            <h2 id="modalTitle" class="modalIn-title"></h2>
            <!-- Add content for "New" modal here -->
            <!--------------------------------------------------------------------CREATE NEW CABINET CONTENT-------------------------------------------------------------------->
            <div class="content y" style="padding:2%;" id="createCabinetModal" v-if="targetModal === 'New Cabinet'">

                <form method="post" action="">
                    <label for="cabinet_name">Cabinet Name:</label>
                    <input type="text" id="cabinet_name" name="cabinet_name" required>
                    <button type="submit" name="createCabinet">Add Cabinet</button>
                </form>
            </div>
            <!--------------------------------------------------------------------CREATE NEW CABINET CONTENT-------------------------------------------------------------------->

            <!--------------------------------------------------------------------CREATE NEW CABINET CONTENT-------------------------------------------------------------------->
            <div class="content y" style="padding:2%;" id="createFoldertModal">

                <form method="post" action="">
                    <!-- Dropdown menu for selecting the cabinet -->
                    <label for="selected_cabinet">Select Cabinet:</label>
                    <select id="selected_cabinet" name="selected_cabinet" required>
                    </select>

                    <br>
                    <label for="folder_name">Folder Name:</label>
                    <input type="text" id="folder_name" name="folder_name" required>


                    <button type="submit" name="createFolder">Add Folder</button>
                </form>


            </div>
            <!--------------------------------------------------------------------CREATE NEW CABINET CONTENT-------------------------------------------------------------------->

            <!--------------------------------------------------------------------CREATE NEW CABINET CONTENT-------------------------------------------------------------------->
            <div class="content y" style="padding:2%;" id="uploadDocumetstModal">
                <form method="post" action="" enctype="multipart/form-data">
                    <!-- Dropdown menu for selecting the cabinet -->
                    <label for="selected_cabinet">Select Cabinet:</label>
                    <select id="selected_cabinet2" name="selected_cabinet" required>
                        <option value="" selected="selected">Select Cabinet</option>
                    </select>

                    <!-- Dropdown menu for selecting the folder -->
                    <label for="selected_folder">Select Folder:</label>
                    <select id="selected_folder" name="selected_folder" required>
                    </select>

                    <!-- File input for multiple file uploads -->
                    <label for="files">Select Files:</label>
                    <input type="file" id="files" name="files[]" multiple accept=".pdf">

                    <button type="submit" name="uploadDocuments">Upload Files</button>
                </form>
            </div>
            <!--------------------------------------------------------------------CREATE NEW CABINET CONTENT-------------------------------------------------------------------->


        </div>
    </div>
</template>

<script>

export default {
    props: {
        targetModal: String, // Define the prop type
    },
    data() {
        return {
            activeTab: 0,
            // target: true,
        };
    },
    methods: {
        closeModal() {
            // Emit an event to inform the parent component to close the modal
            this.$emit('close-modal');
        },
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
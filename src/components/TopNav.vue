<template>
    <div style="font-weight:bolder">
        <div class="y">
            <div class="c">
                <input class="g" name="repository_tab" value="0" type="radio" v-model="activeTab" />
                <li class="x y tab" @click="_tab(0)"><span class="material-symbols-outlined" style="float:left; ">add</span>
                    &nbsp; New
                    <ul class="dropdown-menuT">
                        <li @click="() => showModal('New Cabinet')">New Cabinet</li>
                        <li @click="() => showModal('New Folder')">New Folder</li>
                        <li @click="() => showModal('Upload Document(s) From Computer')">
                            Upload Document(s) From Computer
                        </li>
                        <!-- <li @click="() => showModal('Import Template')">Import Template</li> -->
                        <li @click="() => showModal('New Report')">New Report</li>
                    </ul>
                </li>
            </div>
            <div class="c">
                <input class="g" name="repository_tab" value="1" type="radio" v-model="activeTab" />
                <li class="x y tab" @click="_tab(1)"><span class="material-symbols-outlined"
                        style="float:left; ">search</span> &nbsp; Search</li>
            </div>
            <div class="c">
                <input class="g" name="repository_tab" value="2" type="radio" v-model="activeTab" />
                <li class="x y tab" @click="_tab(2)"><span class="material-symbols-outlined"
                        style="float:left; ">image</span> &nbsp; Thumbnails</li>
            </div>
            <div class="c">
                <input class="g" name="repository_tab" value="3" type="radio" v-model="activeTab" />
                <li class="x y tab" @click="_tab(3)"><span class="material-symbols-outlined"
                        style="float:left; ">view_list</span> &nbsp; List View</li>
            </div>
            <div class="c">
                <input class="g" name="repository_tab" value="4" type="radio" v-model="activeTab" />
                <li class="x y tab" @click="_tab(4)"><span class="material-symbols-outlined"
                        style="float:left; ">bar_chart</span> &nbsp; Reports</li>
            </div>
            <div class="c">
                <input class="g" name="repository_tab" value="5" type="radio" v-model="activeTab" />
                <li class="x y tab" @click="_tab(5)">
                    <span class=" material-symbols-outlined" style="float:left; ">settings</span> &nbsp; Properties
                </li>
            </div>
            <div class="e"></div>
        </div>
    </div>
    <ModalView :targetModal="targetModal" @close-modal="closeModalHandler" />
</template>

<script>
import ModalView from "./ModalView.vue";

export default {
    components: {
        ModalView,
    },
    data() {
        return {
            activeTab: 3,
            targetModal: '',
            openSearch: false,
        };
    },
    methods: {
        _tab(index) {
            this.activeTab = index;
            switch (index) {
                case 1:
                    this.openSearch = true;
                    break;
                case 2:
                    this.$emit('show-grid-view');
                    break;
                case 3:
                    this.$emit('show-list-view');
                    break;
                case 4:
                    this.$emit('show-report');
                    break;
                case 5:
                    this.$emit('show-properties');
                    break;
                // Add cases for other tabs
                default:
                    break;
            }
        },
        showModal(targetModal) {
            this.targetModal = targetModal;
        },
        closeModalHandler() {
            // Update the targetModal prop to close the modal
            this.targetModal = '';
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
<template>
    <div class="sidebar-right sidebar-mini layout-navbar-fixed layout-fixed text-sm sidebar-light-indigo elevation-4"
        id="sidebarRight">
        <!-- Add content for right sidebar here -->
        <div class="content y mx-3" style="padding:2%">
            <div class="row">
                <div class="col-6">
                    <div><b style="font-size:16px"><u>Properties</u></b></div>
                </div>
                <div class="col-6">
                    <div class="close" @click="hideRightSidebar(), updateChartSizes();">&times;</div>
                </div>
            </div>
        </div>
        <div class="container y mx-1" style="padding:2%" id="dashboardPropertiesTabs">
            <div style="font-weight:bolder">
                <div class="y">
                    <div class="c" v-for="(tab, index) in tabs" :key="index">
                        <input class="g" :name="`dashboard_properties_tab`" :value="index" type="radio"
                            v-model="activeTab" />
                        <li class="x y rsbtab" @click="_tab(index)">{{ tab.name }}</li>
                    </div>
                    <div class="e"></div>
                </div>
            </div>
            <div class="x y ba">
                <div v-for="(tab, index) in tabs" :key="index">
                    <input class="g" :name="`dashboard_properties_tabv${index}`"
                        :type="activeTab === index ? 'radio' : 'hidden'" :checked="activeTab === index" />
                    <div class="rsbtabv x y">
                        <!-- Dynamically render content based on the selected tab -->
                        <template v-if="activeTab === index">
                            <component :is="tab.component" :document="document" :lookups="lookups" :serials="serials"
                                :current_folder="current_folder" @update-index-field-data="updateIndexFieldData"
                                @update-meta-data-data="updateMetaDataData" />
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MetaDataTab from "@/components/MetaDataTab.vue"; // Import your component for Meta Data
import IndexFieldsTab from "@/components/IndexFieldsTab.vue";//Import your component for Index Fields
import PermissionsTab from "@/components/PermissionsTab.vue";
// import AutomationTab from "@/components/AutomationTab.vue";
// Import other components for Permissions and Automations if available
import { useToast } from "vue-toastification";

export default {
    props: {
        document: {},
        current_folder: {},
    },
    data() {
        return {
            toast: useToast(),
            baseUrl: this.baseApiUrl,
            token: localStorage.getItem("edms_token"),
            lookups: [],
            serials: [],
            lookups_pagination: {
                links: '',
                meta: ''
            },
            serials_pagination: {
                links: '',
                meta: ''
            },
            activeTab: 0,
            tabs: [
                { name: 'Meta Data', component: MetaDataTab }, // Specify the component for Meta Data
                { name: 'Index Fields', component: IndexFieldsTab },
                { name: 'Permissions', component: PermissionsTab },
                { name: 'Automation', component: '' },
                // Specify the component for Index Fields
                // Add more tabs as needed
            ],
        };
    },
    components: {
        MetaDataTab,
        IndexFieldsTab,
        PermissionsTab,
        // AutomationTab,
        // Register other components for Permissions and Automations if available
    },
    mounted() {
        this.getLookups();
        this.getSerials();
    },
    methods: {
        hideRightSidebar() {
            this.$emit('hide-sidebar');
        },
        updateChartSizes() {
            console.log('updateChartSizes');
        },
        _tab(index) {
            this.activeTab = index;
        },
        async getLookups() {
            this.lookups = [];
            const response = await fetch(this.baseUrl + '/api/lookups', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();
            // console.log(data.data.data);
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
                this.lookups = data.data.data;
                this.lookups_pagination.links = data.data.links;
                this.lookups_pagination.meta = data.data.meta;
            }
        },
        async getSerials() {
            this.serials = [];
            const response = await fetch(this.baseUrl + '/api/serialisations', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();
            // console.log(data.data.data);
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
                this.serials = data.data.data;
                this.serials_pagination.links = data.data.links;
                this.serials_pagination.meta = data.data.meta;
            }
        },
        refreshData(target_folder) {
            this.$emit('refresh-data', target_folder);
        },
        updateIndexFieldData(action, data) {
            if (action == "add") {
                this.$props.current_folder.fields.push(data);
            } else if (action == "update") {
                this.$props.current_folder.fields.splice(this.$props.current_folder.fields.indexOf(data), 1, data);
            } else if (action == "delete") {
                this.$props.current_folder.fields.splice(this.$props.current_folder.fields.indexOf(data), 1);
            }
        },
        updateMetaDataData(action, data) {
            console.log(data);
            if (action == "add") {
                this.$props.document.doc_fields.push(data);
            } else if (action == "update") {
                let old_data = this.$props.document.doc_fields.find(doc_field => doc_field.id == data.id);
                this.$props.document.doc_fields.splice(this.$props.document.doc_fields.indexOf(old_data), 1, data);
            } else if (action == "delete") {
                let old_data = this.$props.document.doc_fields.find(doc_field => doc_field.id == data.id);
                this.$props.document.doc_fields.splice(this.$props.document.doc_fields.indexOf(old_data), 1);
            }
        }
    },
};
</script>

<style></style>

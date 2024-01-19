<template>
    <div class="sidebar-right sidebar-mini layout-navbar-fixed layout-fixed text-sm sidebar-light-indigo elevation-4" id="sidebarRight">
        <!-- Add content for right sidebar here -->
        <div class="content y" style="padding:2%">
            <div class="row">
                <div class="col-6">
                    <div><b style="font-size:16px"><u>Properties</u></b></div>
                </div>
                <div class="col-6">
                    <div class="close" @click="hideRightSidebar(), updateChartSizes();">&times;</div>
                </div>
            </div>
        </div>
        <!-- DASHBOARD PROPERTIES CONTENT -->
        <div class="container y" style="padding:2%" id="dashboardPropertiesTabs">
            <div style="font-weight:bolder">
                <div class="y">
                    <div class="c" v-for="(tab, index) in tabs" :key="index">
                        <input class="g" :name="`dashboard_properties_tab`" :value="index" type="radio" v-model="activeTab"/>
                        <li class="x y rsbtab" @click="_tab(index)">{{ tab.name }}</li>
                    </div>
                    <div class="e"></div>
                </div>
            </div>
            <div class="x y ba">
                <div v-for="(tab, index) in tabs" :key="index">
                    <input class="g" :name="`dashboard_properties_tabv${index}`" :type="activeTab === index ? 'radio' : 'hidden'" :checked="activeTab === index" />
                    <div class="rsbtabv x y">
                        <!-- Dynamically render content based on the selected tab -->
                        <template v-if="activeTab === index">
                            <component :is="tab.component" />
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MetaDataTab from "@/components/MetaDataTab.vue"; // Import your component for Meta Data
import  IndexFieldsTab from "@/components/IndexFieldsTab.vue";//Import your component for Index Fields
import PermissionsTab from "@/components/PermissionsTab.vue";
// import AutomationTab from "@/components/AutomationTab.vue";
// Import other components for Permissions and Automations if available

export default {
    data() {
        return {
            activeTab: 0,
            tabs: [
                { name: 'Meta Data', component: MetaDataTab }, // Specify the component for Meta Data
                { name: 'Index Fields', component: IndexFieldsTab },
                { name: 'Permissions', component: PermissionsTab },
                { name: 'Automation', component: ''},
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
    },
};
</script>

<style></style>

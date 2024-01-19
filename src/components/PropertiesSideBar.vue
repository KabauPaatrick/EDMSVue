<template>
    <div class="sidebar-right sidebar-mini layout-navbar-fixed layout-fixed text-sm sidebar-light-indigo elevation-4"
        id="sidebarRight">
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
        <!--------------------------------------------------------------------DASHBOARD PROPERTIES CONTENT-------------------------------------------------------------------->
        <div class="container y" style="padding:2%" id="dashboardPropertiesTabs">
            <div style="font-weight:bolder">
                <div class="y">
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="0" type="radio" v-model="activeTab"/>
                        <li class="x y rsbtab" @click="_tab(0)">Meta Data</li>
                    </div>
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="1" type="radio" v-model="activeTab" />
                        <li class="x y rsbtab" @click="_tab(1)">Index Fields</li>
                    </div>
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="2" type="radio" v-model="activeTab" />
                        <li class="x y rsbtab" @click="_tab(2)">Permissions</li>
                    </div>
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="3" type="radio" v-model="activeTab" />
                        <li class="x y rsbtab" @click="_tab(3)">Automations</li>
                    </div>
                    <div class="e"></div>
                </div>
            </div>
            <div class="x y ba">
                <div>
                    <input class="g" name="dashboard_properties_tabv1" type="radio" checked="1" />
                    <div class="rsbtabv x y">contents of Dashboard Properties Side Bar(Meta Data)</div>
                </div>
                <div>
                    <input class="g" name="dashboard_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Dashboard Properties Side Bar(Index Fileds)</div>
                </div>
                <div>
                    <input class="g" name="dashboard_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Dashboard Properties Side Bar(Permissions)</div>
                </div>
                <div>
                    <input class="g" name="dashboard_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Dashboard Properties Side Bar(Automations)</div>
                </div>
            </div>
        </div>
        <!--------------------------------------------------------------------DASHBOARD PROPERTIES CONTENT-------------------------------------------------------------------->
    </div>
</template>
        
       
  
<script>


export default {
    data() {
        return {
            activeTab: 0,
        }
    },
    components: {


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
            // switch (index) {
            //     case 1:
            //         this.openSearch = true;
            //         break;
            //     // Add cases for other tabs
            //     default:
            //         break;
            // }
        },
    },

};
</script>
  
<style></style>
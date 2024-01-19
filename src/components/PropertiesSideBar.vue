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
                        <input class="g" name="dashboard_properties_tab" value="0" type="radio" checked="1" />
                        <li class="x y rsbtab" @click="_tab(this)">Meta Data</li>
                    </div>
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="1" type="radio" />
                        <li class="x y rsbtab" @click="_tab(this)">Index Fields</li>
                    </div>
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="2" type="radio" />
                        <li class="x y rsbtab" @click="_tab(this)">Permissions</li>
                    </div>
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="3" type="radio" />
                        <li class="x y rsbtab" @click="_tab(this)">Automations</li>
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
            //   sidebarWidth: 0, // Initial width of the sidebar
        }
    },
    components: {


    },


    methods: {
        hideRightSidebar() {
            this.$emit('hide-sidebar');
            // Implement the logic for hiding the right sidebar
        },
        updateChartSizes() {
            console.log('updateChartSizes');
            // Implement the logic for updating chart sizes
            // var charts = [barChart, lineChart, pieChart, doughnutChart];
            // charts.forEach(function (chart) {
            //     if (chart) {
            //         chart.resize();
            //     }
            // });
        },
    },

};
</script>
  
<style></style>
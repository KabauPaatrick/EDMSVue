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
                    <div class="close" onclick="hideRightSidebar(), updateChartSizes();">&times;</div>
                </div>
            </div>
        </div>
        <!--------------------------------------------------------------------DASHBOARD PROPERTIES CONTENT-------------------------------------------------------------------->
        <div class="container y rsbcontent" style="padding:2%" id="dashboardPropertiesTabs">
            <div style="font-weight:bolder">
                <div class="y">
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="0" type="radio" checked="1" />
                        <li class="x y rsbtab" onclick="_tab(this)">Meta Data</li>
                    </div>
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="1" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Index Fields</li>
                    </div>
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="2" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Permissions</li>
                    </div>
                    <div class="c">
                        <input class="g" name="dashboard_properties_tab" value="3" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Automations</li>
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

        <!--------------------------------------------------------------------REPOSITORY PROPERTIES CONTENT-------------------------------------------------------------------->
        <div class="container y rsbcontent" style="padding:2%" id="repositoryPropertiesTabs">
            <div style="font-weight:bolder">
                <div class="y">
                    <div class="c">
                        <input class="g" name="repository_properties_tab" value="0" type="radio" checked="1" />
                        <li class="x y rsbtab" onclick="_tab(this)">Meta Data</li>
                    </div>
                    <div class="c">
                        <input class="g" name="repository_properties_tab" value="1" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Index Fields</li>
                    </div>
                    <div class="c">
                        <input class="g" name="repository_properties_tab" value="2" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Permissions</li>
                    </div>
                    <div class="c">
                        <input class="g" name="repository_properties_tab" value="3" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Automations</li>
                    </div>
                    <div class="e"></div>
                </div>
            </div>
            <div class="x y ba">
                <div>
                    <input class="g" name="repository_properties_tabv1" type="radio" checked="1" />
                    <div class="rsbtabv x y">contents of Repository Properties Side Bar(Meta Data)</div>
                </div>
                <div>
                    <input class="g" name="repository_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Repository Properties Side Bar(Index Fileds)</div>
                </div>
                <div>
                    <input class="g" name="repository_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Repository Properties Side Bar(Permissions)</div>
                </div>
                <div>
                    <input class="g" name="repository_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Repository Properties Side Bar(Automations)</div>
                </div>
            </div>
        </div>
        <!--------------------------------------------------------------------REPOSITORY PROPERTIES CONTENT-------------------------------------------------------------------->

        <!--------------------------------------------------------------------RECENTLY VIEWED PROPERTIES CONTENT-------------------------------------------------------------------->
        <div class="container y rsbcontent" style="padding:2%" id="recentlyViewedPropertiesTabs">
            <div style="font-weight:bolder">
                <div class="y">
                    <div class="c">
                        <input class="g" name="recently_viewed_properties_tab" value="0" type="radio" checked="1" />
                        <li class="x y rsbtab" onclick="_tab(this)">Meta Data</li>
                    </div>
                    <div class="c">
                        <input class="g" name="recently_viewed_properties_tab" value="1" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Index Fields</li>
                    </div>
                    <div class="c">
                        <input class="g" name="recently_viewed_properties_tab" value="2" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Permissions</li>
                    </div>
                    <div class="c">
                        <input class="g" name="recently_viewed_properties_tab" value="3" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Automations</li>
                    </div>
                    <div class="e"></div>
                </div>
            </div>
            <div class="x y ba">
                <div>
                    <input class="g" name="recently_viewed_properties_tabv1" type="radio" checked="1" />
                    <div class="rsbtabv x y">contents of Recently Viewed Properties Side Bar(Meta Data)</div>
                </div>
                <div>
                    <input class="g" name="recently_viewed_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Recently Viewed Properties Side Bar(Index Fileds)</div>
                </div>
                <div>
                    <input class="g" name="recently_viewed_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Recently Viewed Properties Side Bar(Permissions)</div>
                </div>
                <div>
                    <input class="g" name="recently_viewed_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Recently Viewed Properties Side Bar(Automations)</div>
                </div>
            </div>
        </div>
        <!--------------------------------------------------------------------RECENTLY VIEWED PROPERTIES CONTENT-------------------------------------------------------------------->

        <!--------------------------------------------------------------------BOOKMARKS PROPERTIES CONTENT-------------------------------------------------------------------->
        <div class="container y rsbcontent" style="padding:2%" id="bookmarksPropertiesTabs">
            <div style="font-weight:bolder">
                <div class="y">
                    <div class="c">
                        <input class="g" name="bookmarks_properties_tab" value="0" type="radio" checked="1" />
                        <li class="x y rsbtab" onclick="_tab(this)">Meta Data</li>
                    </div>
                    <div class="c">
                        <input class="g" name="bookmarks_properties_tab" value="1" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Index Fields</li>
                    </div>
                    <div class="c">
                        <input class="g" name="bookmarks_properties_tab" value="2" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Permissions</li>
                    </div>
                    <div class="c">
                        <input class="g" name="bookmarks_properties_tab" value="3" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Automations</li>
                    </div>
                    <div class="e"></div>
                </div>
            </div>
            <div class="x y ba">
                <div>
                    <input class="g" name="bookmarks_properties_tabv1" type="radio" checked="1" />
                    <div class="rsbtabv x y">contents of Bookmarks Properties Side Bar(Meta Data)</div>
                </div>
                <div>
                    <input class="g" name="bookmarks_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Bookmarks Properties Side Bar(Index Fileds)</div>
                </div>
                <div>
                    <input class="g" name="bookmarks_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Bookmarks Properties Side Bar(Permissions)</div>
                </div>
                <div>
                    <input class="g" name="bookmarks_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Bookmarks Properties Side Bar(Automations)</div>
                </div>
            </div>
        </div>
        <!--------------------------------------------------------------------BOOKMARKS PROPERTIES CONTENT-------------------------------------------------------------------->

        <!--------------------------------------------------------------------SAVED SEARCHES PROPERTIES CONTENT-------------------------------------------------------------------->
        <div class="container y rsbcontent" style="padding:2%" id="savedSearchesPropertiesTabs">
            <div style="font-weight:bolder">
                <div class="y">
                    <div class="c">
                        <input class="g" name="saved_searches_properties_tab" value="0" type="radio" checked="1" />
                        <li class="x y rsbtab" onclick="_tab(this)">Meta Data</li>
                    </div>
                    <div class="c">
                        <input class="g" name="saved_searches_properties_tab" value="1" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Index Fields</li>
                    </div>
                    <div class="c">
                        <input class="g" name="saved_searches_properties_tab" value="2" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Permissions</li>
                    </div>
                    <div class="c">
                        <input class="g" name="saved_searches_properties_tab" value="3" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Automations</li>
                    </div>
                    <div class="e"></div>
                </div>
            </div>
            <div class="x y ba">
                <div>
                    <input class="g" name="saved_searches_properties_tabv1" type="radio" checked="1" />
                    <div class="rsbtabv x y">contents of Saved Searches Properties Side Bar(Meta Data)</div>
                </div>
                <div>
                    <input class="g" name="saved_searches_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Saved Searches Properties Side Bar(Index Fileds)</div>
                </div>
                <div>
                    <input class="g" name="saved_searches_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Saved Searches Properties Side Bar(Permissions)</div>
                </div>
                <div>
                    <input class="g" name="saved_searches_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Saved Searches Properties Side Bar(Automations)</div>
                </div>
            </div>
        </div>
        <!--------------------------------------------------------------------SAVED SEARCHES PROPERTIES CONTENT-------------------------------------------------------------------->

        <!--------------------------------------------------------------------WORKFLOWS PROPERTIES CONTENT-------------------------------------------------------------------->
        <div class="container y rsbcontent" style="padding:2%" id="workFlowsPropertiesTabs">
            <div style="font-weight:bolder">
                <div class="y">
                    <div class="c">
                        <input class="g" name="work_flows_properties_tab" value="0" type="radio" checked="1" />
                        <li class="x y rsbtab" onclick="_tab(this)">Meta Data</li>
                    </div>
                    <div class="c">
                        <input class="g" name="work_flows_properties_tab" value="1" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Index Fields</li>
                    </div>
                    <div class="c">
                        <input class="g" name="work_flows_properties_tab" value="2" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Permissions</li>
                    </div>
                    <div class="c">
                        <input class="g" name="work_flows_properties_tab" value="3" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Automations</li>
                    </div>
                    <div class="e"></div>
                </div>
            </div>
            <div class="x y ba">
                <div>
                    <input class="g" name="work_flows_properties_tabv1" type="radio" checked="1" />
                    <div class="rsbtabv x y">contents of Workflows Properties Side Bar(Meta Data)</div>
                </div>
                <div>
                    <input class="g" name="work_flows_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Workflows Properties Side Bar(Index Fileds)</div>
                </div>
                <div>
                    <input class="g" name="work_flows_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Workflows Searches Properties Side Bar(Permissions)</div>
                </div>
                <div>
                    <input class="g" name="work_flows_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Workflows Properties Side Bar(Automations)</div>
                </div>
            </div>
        </div>
        <!--------------------------------------------------------------------WORKFLOWS PROPERTIES CONTENT-------------------------------------------------------------------->

        <!--------------------------------------------------------------------WORKFLOWS PROPERTIES CONTENT-------------------------------------------------------------------->
        <div class="container y rsbcontent" style="padding:2%" id="settingsPropertiesTabs">
            <div style="font-weight:bolder">
                <div class="y">
                    <div class="c">
                        <input class="g" name="settings_properties_tab" value="0" type="radio" checked="1" />
                        <li class="x y rsbtab" onclick="_tab(this)">Meta Data</li>
                    </div>
                    <div class="c">
                        <input class="g" name="settings_properties_tab" value="1" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Index Fields</li>
                    </div>
                    <div class="c">
                        <input class="g" name="settings_properties_tab" value="2" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Permissions</li>
                    </div>
                    <div class="c">
                        <input class="g" name="settings_properties_tab" value="3" type="radio" />
                        <li class="x y rsbtab" onclick="_tab(this)">Automations</li>
                    </div>
                    <div class="e"></div>
                </div>
            </div>
            <div class="x y ba">
                <div>
                    <input class="g" name="settings_properties_tabv1" type="radio" checked="1" />
                    <div class="rsbtabv x y">contents of Settings Properties Side Bar(Meta Data)</div>
                </div>
                <div>
                    <input class="g" name="settings_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Settings Properties Side Bar(Index Fileds)</div>
                </div>
                <div>
                    <input class="g" name="settings_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Settings Searches Properties Side Bar(Permissions)</div>
                </div>
                <div>
                    <input class="g" name="settings_properties_tabv1" type="radio" />
                    <div class="rsbtabv x y">contents of Settings Properties Side Bar(Automations)</div>
                </div>
            </div>
        </div>
        <!--------------------------------------------------------------------WORKFLOWS PROPERTIES CONTENT-------------------------------------------------------------------->
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
        //     hideRightSidebar() {
        //         this.sidebarWidth = 0;
        //   // Implement the logic for hiding the right sidebar
        // }, 
        // updateChartSizes() {
        //   // Implement the logic for updating chart sizes
        // },
    },

};
</script>
  
<style></style>
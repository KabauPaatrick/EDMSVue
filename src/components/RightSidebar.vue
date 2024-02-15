<template>
    <div class="sidebar-right-static sidebar-mini layout-navbar-fixed layout-fixed text-sm sidebar-light-indigo elevation-4"
        id="sidebarRightStatic">
        <!-- Add content for right sidebar here -->
        <nav class="mt-2">
            <center>
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <li class="nav-item" @click="showRightSidebar('settingsPropertiesTabs');">
                        <a class="nav-link">
                            <span class="material-symbols-outlined"
                                style="font-size: 20px; text-align:justify">account_circle</span>
                        </a>
                    </li>

                    <li class="nav-item" onclick="showRightSidebar('settingsPropertiesTabs');">
                        <a class="nav-link">
                            <span class="material-symbols-outlined" style="font-size: 20px">notifications</span>
                        </a>
                    </li>
                </ul>
            </center>
        </nav>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
        };
    },
    methods: {
        // showRightSidebar(tab) {
        //     this.$emit('show-properties', { tab: tab });
        // },
        showRightSidebar() {
            this.$emit('show-properties');
        },

    },
};
</script>

<style scoped></style>
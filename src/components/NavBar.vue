<template>
    <div class="abs w50 main-sidebar sidebar-light-indigo elevation-4"
        style="padding:10px;font-weight:bold;width: 7%;font-size:12px">
        <!-- Brand Logo -->
        <center>
            <a href="" @click="$router.push('/')">
                <img src="../assets/logo.png" alt="Company Logo" class="img-circle elevation-3"
                    style="opacity: .8;padding:7%" width="50px" height="50px">
            </a><br>
            <div class="font-weight-bold" style="margin-top:10px">DISI EDMS</div>
        </center>
        <hr>
        <div class="" style="padding-bottom:2px;">
            <input class="g" name="sidebar_tab1" value="0" type="radio" v-model="activeTab"/>
            <li class="x y tab" @click="_tab(0)">
                <center><span class="material-symbols-outlined" style="font-size:30px">space_dashboard</span><br>Dashboard
                </center>
            </li>
        </div>
        <div class="" style="padding-bottom:2px">
            <input class="g" name="sidebar_tab1" value="1" type="radio" v-model="activeTab"/>
            <li class="x y tab" @click="_tab(1)">
                <center><span class="material-symbols-outlined" style="font-size:30px">database</span><br>Repository
                </center>
            </li>
        </div>
        <div class="" style="padding-bottom:2px">
            <input class="g" name="sidebar_tab1" value="2" type="radio" v-model="activeTab" />
            <li class="x y tab" @click="_tab(2)">
                <center><span class="material-symbols-outlined" style="font-size:30px">calendar_clock</span><br>Recently
                    Viewed</center>
            </li>
        </div>
        <div class="" style="padding-bottom:2px">
            <input class="g" name="sidebar_tab1" value="3" type="radio" v-model="activeTab" />
            <li class="x y tab" @click="_tab(3)">
                <center><span class="material-symbols-outlined"
                        style="font-size:30px">collections_bookmark</span><br>Bookmarks</center>
            </li>
        </div>
        <div class="" style="padding-bottom:2px">
            <input class="g" name="sidebar_tab1" value="4" type="radio" v-model="activeTab" />
            <li class="x y tab" @click="_tab(4)">
                <center><span class="material-symbols-outlined" style="font-size:30px">saved_search</span><br>Saved Searches
                </center>
            </li>
        </div>
        <div class="" style="padding-bottom:2px">
            <input class="g" name="sidebar_tab1" value="5" type="radio" v-model="activeTab" />
            <li class="x y tab" @click="_tab(5)">
                <center><span class="material-symbols-outlined" style="font-size:30px">flowsheet</span><br>Workflows
                </center>
            </li>
        </div>
        <div class="" style="padding-bottom:2px">
            <input class="g" name="sidebar_tab1" value="6" type="radio" v-model="activeTab" />
            <li class="x y tab" @click="_tab(6)">
                <center><span class="material-symbols-outlined" style="font-size:30px">settings</span><br>Settings</center>
            </li>
        </div>
    </div>
</template>
  
<script>
// import { ref } from 'vue';

export default {
    data() {
        return {
            // activeTab: ref(this.$route.name == 'Repository' ? 0 : 0),
        };
    },
    computed: {
        activeTab(){
        switch (this.$route.name) {
            case "Dashboard":
                return 0;
            case "Repository":
                return 1;
            case "Recently Viewed":
                return 2;
            case "Bookmarks":
                return 3;
            // Add cases for other tabs
            default:
                return 0;
                // break;
        }
        }
    },
    methods: {
        _tab(index) {
            // this.activeTab = index;
            switch (index) {
                case 0:
                    this.$router.push('/dashboard');
                    break;
                case 1:
                    this.$router.push('/repository');
                    break;
                case 2:
                    this.$router.push('/recently_viewed');
                    break;
                case 3:
                    this.$router.push('/bookmarks');
                    break;
                case 4:
                    this.$router.push('/saved_search');
                    break;
                case 5:
                    this.$router.push('/');
                    break;
                case 6:
                    this.$router.push('/documentviewer');
                    break;
                // Add cases for other tabs
                default:
                    break;
            }
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

/* Add styles for other tab content as needed */
</style>

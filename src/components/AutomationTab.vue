<template>
    <div>
        <div v-for="workstep in worksteps" :key="workstep.id">
            <div class="card text-center">
                <div class="card-header bg-secondary">
                    <h3>{{ workstep.activity }}</h3>
                    <p class="card-title">{{ workstep.description }}</p>
                </div>
                <div class="card-body" v-for="possible_action in workstep.possible_actions" :key="possible_action.id">
                    <p class="card-text">{{ possible_action.description }}</p>
                    <form v-on:submit.prevent="addWorkstepResult(possible_action)">
                        <button type="submit" class="btn btn-primary" name="addWorkstepResult">{{ possible_action.name
                        }}</button>
                    </form>
                    <hr />
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>

// import the styles
import 'vue3-treeselect/dist/vue3-treeselect.css';
import { useToast } from "vue-toastification";
export default {
    // register the component
    components: {},
    props: {
        document: {},
        current_folder: {},
    },
    data() {
        return {
            toast: useToast(),
            baseUrl: this.baseApiUrl,
            token: localStorage.getItem("edms_token"),
            worksteps: [],
            workstep_id: '',
            document_id: '',
            action_id: '',
            value: '',
        };
    },
    computed: {

    },
    mounted() {

    },
    watch: {
        '$props.document': {
            immediate: true, // Execute the handler immediately after component is created
            handler(document) {
                this.worksteps = [];
                this.$progress.start();
                if (document != null) {
                    this.getWorksteps(document.folder_id);
                }
                this.$progress.finish();
            },
        },
    },
    methods: {
        async getWorksteps(target_folder) {
            const response = await fetch(this.baseUrl + '/api/folder/' + target_folder + '/worksteps', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();
            // console.log(data);
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
                this.worksteps = data.data.data;
            }
        },
        async addWorkstepResult(possible_action) {
            // Implement logic to handle editing the indexing field
            this.workstep_id = possible_action.workstep_id;
            this.document_id = this.document.id;
            this.action_id = possible_action.id;
            this.value = possible_action.name;
            const response = await fetch(this.baseUrl + '/api/workstep/workstepresults/store', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    workstep_id: this.workstep_id,
                    document_id: this.document_id,
                    action_id: this.action_id,
                    value: this.value,
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
                this.$emit('get-folder', data.data.data.workstep.folder_id);
            }
        },
    },
};
</script>
  
<style scoped></style>
  
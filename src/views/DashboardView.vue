<template>
    <div>
        <input class="g" name="sidebar_tabv1" type="radio" checked="1" />
        <div class="tabv x y">
            <!--------------------------------------------------------------------------------------------------------------------------------------------------->
            <!--contents of Dashboard-->
            <!--<div class="x y cd">NORMAL TABS : menu on the top</div>-->

            <!-- Main content -->
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-6 ">
                            <div class="card elevation-3">
                                <div class="card-header">
                                    <h3 class="card-title"><b>Assigned Tasks</b></h3>
                                </div>
                                <!-- /.card-header -->
                                <div class="card-body table-responsive">
                                    <table class="table table-hover table-bordered text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Task</th>
                                                <th>Task ID</th>
                                                <th>Time Assigned</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1.</td>
                                                <td>Policy Publishing > Review</td>
                                                <td>
                                                    POL/2023/ED/90
                                                </td>
                                                <td>26 min ago</td>
                                            </tr>
                                            <tr>
                                                <td>2.</td>
                                                <td>HR Leave Processing > Leave Approval</td>
                                                <td>
                                                    HR/12112023/003
                                                </td>
                                                <td>4 min ago</td>
                                            </tr>
                                            <tr>
                                                <td>3.</td>
                                                <td>Hospital Records > Patient Discharge</td>
                                                <td>
                                                    EMR/0234
                                                </td>
                                                <td>1 min ago</td>
                                            </tr>
                                            <tr>
                                                <td>4.</td>
                                                <td>Hospital Records > Patient Discharge</td>
                                                <td>
                                                    EMR/0234
                                                </td>
                                                <td>1 min ago</td>
                                            </tr>
                                            <tr>
                                                <td>5.</td>
                                                <td>Hospital Records > Patient Discharge</td>
                                                <td>
                                                    EMR/0234
                                                </td>
                                                <td>1 min ago</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!-- /.card-body -->
                                <div class="card-footer clearfix">
                                    <ul class="pagination pagination-sm m-0 float-right">
                                        <li class="page-item"><a class="page-link" href="#">&laquo;</a></li>
                                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                                        <li class="page-item"><a class="page-link" href="#">&raquo;</a></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- /.card -->

                        </div>
                        <!-- /.col -->
                        <div class="col-md-6">
                            <div class="card elevation-3">
                                <div class="card-header">
                                    <h3 class="card-title"><b>Tasks Status</b></h3>
                                </div>
                                <!-- /.card-header -->
                                <div class="card-body">

                                    <canvas id="myChart" width="40%" height="27vw"></canvas>
                                </div>
                                <!-- /.card-body -->
                                <div class="card-footer clearfix">
                                    <!-- <ul class="pagination pagination-sm m-0 float-right">
                                        <li class="page-item"><a class="page-link" href="#">&laquo;</a></li>
                                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                                        <li class="page-item"><a class="page-link" href="#">&raquo;</a></li>
                                    </ul> -->
                                </div>
                            </div>
                            <!-- /.card -->

                        </div>
                        <!-- /.col -->
                    </div>


                    <div class="row">
                        <div class="col-md-6">
                            <div class="card elevation-3">
                                <div class="card-header">
                                    <h3 class="card-title"><b>Assigned Workflows</b></h3>
                                </div>
                                <!-- /.card-header -->
                                <div class="card-body table-responsive">
                                    <table class="table table-hover table-bordered text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Workflow</th>
                                                <th>Assigned By</th>
                                                <th>Date Assigned</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1.</td>
                                                <td>Policy Publishing</td>
                                                <td>
                                                    HOD
                                                </td>
                                                <td>14 Sep 2023</td>
                                            </tr>
                                            <tr>
                                                <td>2.</td>
                                                <td>HR Leave Processing</td>
                                                <td>
                                                    HR
                                                </td>
                                                <td>1 Jan 2023</td>
                                            </tr>
                                            <tr>
                                                <td>3.</td>
                                                <td>Hospital Records</td>
                                                <td>
                                                    HOD
                                                </td>
                                                <td>1 Jan 2023</td>
                                            </tr>
                                            <tr>
                                                <td>4.</td>
                                                <td>Hospital Records</td>
                                                <td>
                                                    HOD
                                                </td>
                                                <td>1 Jan 2023</td>
                                            </tr>
                                            <tr>
                                                <td>5.</td>
                                                <td>Hospital Records</td>
                                                <td>
                                                    HOD
                                                </td>
                                                <td>1 Jan 2023</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!-- /.card-body -->
                                <div class="card-footer clearfix">
                                    <ul class="pagination pagination-sm m-0 float-right">
                                        <li class="page-item"><a class="page-link" href="#">&laquo;</a></li>
                                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                                        <li class="page-item"><a class="page-link" href="#">&raquo;</a></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- /.card -->

                        </div>
                        <!-- /.col -->
                        <div class="col-md-6">
                            <div class="card elevation-3">
                                <div class="card-header">
                                    <h3 class="card-title"><b>Task Handle Time(in minutes)</b></h3>
                                </div>
                                <!-- /.card-header -->
                                <div class="card-body">
                                    <canvas id="myChart2" width="40%" height="27%"></canvas>

                                </div>
                                <!-- /.card-body -->
                                <div class="card-footer clearfix">
                                    <!-- <ul class="pagination pagination-sm m-0 float-right">
                                        <li class="page-item"><a class="page-link" href="#">&laquo;</a></li>
                                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                                        <li class="page-item"><a class="page-link" href="#">&raquo;</a></li>
                                    </ul> -->
                                </div>
                            </div>
                            <!-- /.card -->

                        </div>
                        <!-- /.col -->
                    </div>
                    <!-- /.row -->
                    <!-- /.row -->
                    <!-- /.row -->
                    <!-- /.row -->
                    <!-- /.row -->
                </div><!-- /.container-fluid -->
            </section>
            <!-- /.content -->
        </div>
    </div>
</template>
<script>
import Chart from 'chart.js/auto';

export default {
    mounted() {
        // Data for Tasks Status Chart
        var taskStatusData = {
            labels: ['Missed', 'Completed', 'Extended', 'Unassigned', 'Reassigned'],
            datasets: [{
                label: 'Task Status',
                data: [10, 20, 15, 5, 8],
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(153, 102, 255, 1)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1
            }]
        };

        // Configuration for Tasks Status Chart
        var taskStatusConfig = {
            type: 'bar',
            data: taskStatusData,
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        offset: true
                    }
                }
            }
        };

        // Create Tasks Status Chart
        var taskStatusCtx = document.getElementById('myChart').getContext('2d');
        new Chart(taskStatusCtx, taskStatusConfig);

        // Data for Task Handle Time Chart
        var taskHandleTimeData = {
            labels: ['60+', '51-60', '41-50', '31-40', '21-30', '11-20', '0-10'],
            datasets: [{
                label: 'Tasks Handle Time (in minutes)',
                data: [15, 30, 25, 20, 10, 5, 8],
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        };

        // Configuration for Task Handle Time Chart
        var taskHandleTimeConfig = {
            type: 'bar',
            data: taskHandleTimeData,
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        offset: true
                    }
                }
            }
        };

        // Create Task Handle Time Chart
        var taskHandleTimeCtx = document.getElementById('myChart2').getContext('2d');
        new Chart(taskHandleTimeCtx, taskHandleTimeConfig);
    }
};
</script>

<style scoped>
/* Your component-specific styles go here */
</style>

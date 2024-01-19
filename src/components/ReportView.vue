<template>
    <div>
        <input class="g" name="repository_tabv1" type="radio" />
        <div class="x y">

            <div class="row">
                <div class="col-md-6 ">
                    <div class="card elevation-3">
                        <div class="card-header">
                            <h3 class="card-title"><b>Report 1</b></h3>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">
                            <canvas id="barChart" width="400" height="400"></canvas>

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
                <div class="col-md-6">
                    <div class="card elevation-3">
                        <div class="card-header">
                            <h3 class="card-title"><b>Report 2</b></h3>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">
                            <canvas id="doughnutChart" width="400" height="400"></canvas>
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
                <div class="col-md-6 ">
                    <div class="card elevation-3">
                        <div class="card-header">
                            <h3 class="card-title"><b>Report 3</b></h3>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">
                            <canvas id="lineChart" width="400" height="400"></canvas>
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
                <div class="col-md-6">
                    <div class="card elevation-3">
                        <div class="card-header">
                            <h3 class="card-title"><b>Report 3</b></h3>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">
                            <canvas id="pieChart" width="30%" height="30%"></canvas>
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

        </div>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';
export default {

    mounted() {
        function updateChartSizes() {
            var charts = [barChart, lineChart, pieChart, doughnutChart];
            charts.forEach(function (chart) {
                if (chart) {
                    chart.resize();
                }
            });
        }

        // Bar Chart
        var barData = {
            labels: ['Category A', 'Category B', 'Category C', 'Category D'],
            datasets: [{
                label: 'Data Set 1',
                data: [12, 19, 3, 5],
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
            }]
        };

        var barConfig = {
            type: 'bar',
            data: barData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        var barCtx = document.getElementById('barChart').getContext('2d');
        var barChart = new Chart(barCtx, barConfig);

        // Line Chart
        var lineData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Data Set 1',
                data: [12, 19, 3, 5, 2, 3],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        };

        var lineConfig = {
            type: 'line',
            data: lineData
        };

        var lineCtx = document.getElementById('lineChart').getContext('2d');
        var lineChart = new Chart(lineCtx, lineConfig);

        // Pie Chart
        var pieData = {
            labels: ['Category A', 'Category B', 'Category C'],
            datasets: [{
                data: [30, 40, 30],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)'
                ]
            }]
        };

        var pieConfig = {
            type: 'pie',
            data: pieData
        };

        var pieCtx = document.getElementById('pieChart').getContext('2d');
        var pieChart = new Chart(pieCtx, pieConfig);

        // Doughnut Chart
        var doughnutData = {
            labels: ['Category A', 'Category B', 'Category C'],
            datasets: [{
                data: [30, 40, 30],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)'
                ]
            }]
        };

        var doughnutConfig = {
            type: 'doughnut',
            data: doughnutData
        };

        var doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
        var doughnutChart = new Chart(doughnutCtx, doughnutConfig);

        // Event listener for window resize
        window.addEventListener('resize', function () {
            updateChartSizes();
        });

        // Initial update of chart sizes
        updateChartSizes();
    }
};
</script>
  
<style scoped></style>
  
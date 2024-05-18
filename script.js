const ctx = document.querySelector("#myChart");

const plugin = {
    id: "customCanvasBackgroundColor",
    beforeDraw: (chart, args, options) => {
        const { ctx } = chart;
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = options.color || "hsl(180, 100%, 80%)";
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    },
};

const api = fetch("data.json")
    .then((res) => res.json())
    .then((items) => {
        let data = [];
        let labels = [];
        items.forEach((item) => {
            data.push(item.amount);
            labels.push(item.day);
        });
        const maxValue = Math.max(...data);
        let backgroundColors = data.map((value) => {
            if (value === maxValue) {
                return "hsl(186, 34%, 60%)";
            } else {
                return "hsl(10, 79%, 65%)";
            }
        });

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "",
                        data: data,
                        borderWidth: 0,
                        borderRadius: 3,
                        borderSkipped: false,
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: [
                            "hsl(10, 82%, 80%)",
                            "hsl(10, 82%, 80%)",
                            "hsl(186, 51%, 75%)",
                            "hsl(10, 82%, 80%)",
                            "hsl(10, 82%, 80%)",
                            "hsl(10, 82%, 80%)",
                            "hsl(10, 82%, 80%)",
                        ],
                    },
                ],
            },
            options: {
                
                onHover: function (event, elements) {
                    var chart = this;
                    if (elements && elements.length) {
                        chart.canvas.style.cursor = "pointer";
                    } else {
                        chart.canvas.style.cursor = "default";
                    }
                },
                plugins: {
                    customCanvasBackgroundColor: {
                        color: "transparent",
                    },
                    legend: false,
                    tooltip: {
                        displayColors: false,
                        backgroundColor: "hsl(25, 47%, 15%)",
                        callbacks: {
                            title: function () {
                                return "";
                            },
                            label: function (context) {
                                let label = context.dataset.label || "";
                                if (label) {
                                    label += ": ";
                                }
                                label += "$" + context.formattedValue;
                                return label;
                            },
                        },
                        bodyFont: {
                            size: 20,
                        },
                    },
                },
                scales: {
                    y: {
                        display: false,
                        beginAtZero: true,
                        grid: {
                            display: false,
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            font: {
                                family: "DM Sans",
                                size: 14, 
                                bodyColor: "#fff",
                            },
                        },
                    },
                },
            },
            plugins: [plugin],
        });
    });
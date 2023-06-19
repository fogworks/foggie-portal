export const pieOption = {
  tooltip: {
    trigger: "item",
    formatter: '{b}:{c}',

  },
  color: ["#777", "#ccc", "#29ABFF"],
  series: [
    {
      type: "pie",
      radius: ["60%", "85%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 0,
        borderWidth: 0,
      },
      label: {
        show: false,
        position: "center",
        rich: {
          value: {
            color: "#000",
            fontWeight: 700,
            fontSize: 30,
            lineHeight: 30,
          },
          title: {
            color: "#777",
            fontSize: 14,
          },
        },
      },
      emphasis: {
        label: {
          show: false,
          fontSize: 40,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [{ value: 0 }, { value: 0 }, { value: 1 }],
    },
  ],
};

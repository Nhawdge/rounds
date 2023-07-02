const { createApp } = Vue;

var app = createApp({
  data() {
    return {
      time: 0,
      totalTime: 0,
      timerId: null,
      currentState: "Idle",
    };
  },
  methods: {
    startRound(workTime, breakTime) {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.currentState = "Work";
      this.time = 1000 * 60 * workTime;
      this.totalTime = this.time;
      this.timerId = setInterval(() => {
        this.time -= 250;
        if (this.time <= 0) {
          clearInterval(this.timerId);
          this.startBreak(breakTime);
        }
      }, 250);
    },
    startBreak(breakTime) {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.currentState = "Break";
      this.time = 1000 * 60 * breakTime;
      this.totalTime = this.time;
      this.timerId = setInterval(() => {
        this.time -= 250;
        if (this.time <= 0) {
          clearInterval(this.timerId);
          this.currentState = "Idle";
        }
      }, 250);
    },
    displayTime() {
      var minutes = ("00" + Math.floor(this.time / 1000 / 60)).substr(-2);
      var seconds = ("00" + Math.floor((this.time / 1000) % 60)).substr(-2);
      return `${minutes}:${seconds}`;
    },
    handStyle() {
      let rotate = -90 - (this.time / this.totalTime) * 360;

      return {
        transform: `rotate(${rotate}deg) translate(150px, 0px)`,
      };
    },
  },
});

// app.component('page', {
//     props: ['page'],
//     template: "#page",
//     methods:
//     {

//     },
// })

app.mount("#app");

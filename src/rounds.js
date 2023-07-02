const { createApp } = Vue;

var app = createApp({
  data() {
    return {
      endTime: null,
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

      this.startTimer(workTime, () => {
        this.currentState = "Break";
        this.startTimer(breakTime, () => {
          this.currentState = "Idle";
        });
      });
    },

    startTimer(timeInMinutes, callback) {
      this.time = 1000 * 60 * timeInMinutes;
      this.totalTime = this.time;
      this.endTime = new Date(Date.now() + this.time);

      this.timerId = setInterval(() => {
        var now = new Date();
        var diff = this.endTime - now;
        this.time = diff;

        this.time -= 100;
        if (this.time <= 0) {
          clearInterval(this.timerId);
          callback();
        }
      }, 100);
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

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const playlist = $(".playlist");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "エイプリル",
      singer: "mol-74",
      path: "../assets/music/song1.mp3",
      image: "../assets/img/song1.jpg",
    },
    {
      name: "望み",
      singer: "odol",
      path: "../assets/music/song2.mp3",
      image: "../assets/img/song2.jpg",
    },
    {
      name: "夏霞",
      singer: "あたらよ",
      path: "../assets/music/song3.mp3",
      image: "../assets/img/song3.jpg",
    },
    {
      name: "8.8",
      singer: "あたらよ",
      path: "../assets/music/song4.mp3",
      image: "../assets/img/song4.jpg",
    },
    {
      name: "水平線",
      singer: "back-number",
      path: "../assets/music/song5.mp3",
      image: "../assets/img/song5.jpg",
    },
    {
      name: "白日",
      singer: "King Gnu",
      path: "../assets/music/song6.mp3",
      image: "../assets/img/song6.jpg",
    },
    {
      name: "逆夢",
      singer: "King Gnu",
      path: "../assets/music/song7.mp3",
      image: "../assets/img/song7.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Prevent page from scrolling when press spacebar
    window.onkeydown = function (e) {
      return !(e.keyCode == 32);
    };

    // Handle rotate cd thumb
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Handle zoom in/out cd thumb
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDWidth = cdWidth - scrollTop;
      cd.style.width = newCDWidth > 0 ? `${newCDWidth}px` : 0;
      cd.style.opacity = newCDWidth / cdWidth;
    };

    // Handle play pause spacebar
    document.onkeyup = function (e) {
      if (e.code === "Space") {
        if (_this.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      }
    };

    // Handle click play button
    playBtn.onclick = () => {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // When song is played
    audio.onplay = () => {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
      document.title = `${_this.currentSong.name} - ${_this.currentSong.singer}`;
    };

    // When song is paused
    audio.onpause = () => {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
      document.title = "Music Player";
    };

    // Move progress bar
    audio.ontimeupdate = () => {
      if (audio.currentTime > 0) {
        const progressPercentage = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercentage;
      }
    };

    // Handle fast forward song
    progress.onchange = (e) => {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    };

    // Skip to next song
    nextBtn.onclick = () => {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.loadNextSong();
      }
      audio.play();
      _this.render();
    };

    // Back to previous song
    prevBtn.onclick = () => {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.loadPrevSong();
      }
      audio.play();
      _this.render();
    };

    // Handle random button on/off
    randomBtn.onclick = (e) => {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Handle repeat button on/off
    repeatBtn.onclick = (e) => {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Handle song ends
    audio.onended = () => {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Handle click on song
    playlist.onclick = (e) => {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          this.currentIndex = Number(songNode.dataset.index);
          this.loadCurrentSong();
          audio.play();
          this.render();
        }
      }
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },
  loadPrevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  loadNextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    this.defineProperties();
    this.render();

    this.handleEvents();

    // Load current song
    this.loadCurrentSong();
  },
};

app.start();

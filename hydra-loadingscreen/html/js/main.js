const songs = [
    {
        image: 'assets/travis.jpg',
        artists: 'Travis Scott, James Blake, 21 Savage',
        songname: 'TIL FURTHER NOTICE (feat. James Blake & 21 Savage)',
        audioname: 'mp3/travis.mp3'
    },
    {
        image: 'assets/dave.jpg',
        artists: 'Santan Dave',
        songname: 'Game of Thrones',
        audioname: 'mp3/dave.mp3'
    },
    {
        image: 'assets/drake.jpg',
        artists: 'Drake',
        songname: 'Jumbotron Shit Poppin',
        audioname: 'mp3/drake.mp3'
    },
];

let currentSongIndex = 0;
let sound;
let currentVolume = 0.5;

function loadSong(songIndex) {
    const song = songs[songIndex];
    document.getElementById('song-image').src = song.image;
    document.getElementById('song-title').innerText = song.songname;
    document.getElementById('song-artist').innerText = song.artists;

    if (sound) {
        sound.unload();
    }

    sound = new Howl({
        src: [song.audioname],
        html5: true,
        volume: currentVolume,
        onplay: function () {
            updateProgress();
            document.getElementById('play-pause-button').innerHTML = '<i class="fas fa-pause-circle"></i>';
        },
        onpause: function () {
            document.getElementById('play-pause-button').innerHTML = '<i class="fas fa-play-circle"></i>';
        },
        onend: function () {
            document.getElementById('play-pause-button').innerHTML = '<i class="fas fa-play-circle"></i>';
            nextSong();
        },
        onload: function () {
            const duration = sound.duration();
            document.getElementById('duration').innerText = formatTime(duration);
            document.getElementById('progress-bar').max = duration;
        }
    });

    document.getElementById('volume-bar').value = currentVolume * 100;
    sound.play();
}

window.onload = function () {
    loadSong(currentSongIndex);
}

document.getElementById('play-pause-button').addEventListener('click', function () {
    togglePlayPause();
});

function updateProgress() {
    const seek = sound.seek() || 0;
    document.getElementById('current-time').innerText = formatTime(seek);
    document.getElementById('progress-bar').value = seek;
    if (sound.playing()) {
        requestAnimationFrame(updateProgress);
    }
}

function formatTime(secs) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = Math.floor(secs - minutes * 60) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

document.getElementById('volume-bar').addEventListener('input', function () {
    currentVolume = this.value / 100;
    sound.volume(currentVolume);
});

document.getElementById('progress-bar').addEventListener('input', function () {
    sound.seek(this.value);
});

document.getElementById('next-button').addEventListener('click', function () {
    nextSong();
});

document.getElementById('prev-button').addEventListener('click', function () {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
});

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
}

function togglePlayPause() {
    if (sound.playing()) {
        sound.pause();
    } else {
        sound.play();
    }
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        event.preventDefault();
        togglePlayPause();
    }
});
const folder = "Player";
const library = document.getElementById("library");
const favorites = document.getElementById("favorites");

let currentAudio = null;
let currentSongElement = null;

const seekbar = document.getElementById("seekbar");
const currentTimeSpan = document.getElementById("current-time");
const durationSpan = document.getElementById("duration");



function formatTime(seconds) {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function setupSeekbar(audio) {
	audio.addEventListener("loadedmetadata", () => {
		seekbar.max = Math.floor(audio.duration);
		durationSpan.textContent = formatTime(audio.duration);
	});
	audio.addEventListener("timeupdate", () => {
		seekbar.value = Math.floor(audio.currentTime);
		currentTimeSpan.textContent = formatTime(audio.currentTime);
	});
	seekbar.oninput = () => {
		audio.currentTime = seekbar.value;
	};
}

function playSong(title, url, element = null) {
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
	}
	currentAudio = new Audio(url);
	setupSeekbar(currentAudio);
	currentAudio.play();

	document.getElementById("song-info").innerHTML = `<b>${title}</b>`;
	currentSongElement = element;
}



function createSongElement(title, url, displayName, isFav = false) {
	const songDiv = document.createElement("div");
	songDiv.classList.add("song-item");
	songDiv.dataset.title = title;
	songDiv.dataset.url = url;

	songDiv.innerHTML = `
		<i class="fas fa-music"></i> ${displayName}
		<button class="fav-btn">
			<i class="fas fa-heart" style="color:${isFav ? '#ff69b4' : '#aaa'}"></i>
		</button>
	`;

	return songDiv;
}


/* Load songs from folder */
// async function getSongsFromFolder(folder) {
// 	const res = await fetch(`/${folder}/`);
// 	const text = await res.text();
// 	const tempDiv = document.createElement("div");
// 	tempDiv.innerHTML = text;

// 	const links = tempDiv.querySelectorAll("a");
// 	const songs = [];
// 	links.forEach(link => {
// 		const href = link.getAttribute("href");
// 		if (href && href.endsWith(".mp3")) {
// 			songs.push(`${folder}/${href}`);
// 		}
// 	});
// 	return songs;
// }


// async function loadLibrary() {
// 	const songs = await getSongsFromFolder(folder);
// 	songs.forEach(song => {
// 		const fileName = song.split("/").pop();
// 		const baseName = fileName.replace(/\.mp3$/i, "");
// 		const songDiv = createSongElement(baseName, song, fileName);
// 		library.appendChild(songDiv);
// 	});
// }
// loadLibrary();



library.addEventListener("click", (event) => {
	const songElement = event.target.closest(".song-item");
	if (!songElement) return;

	if (event.target.closest(".fav-btn")) {
		toggleFavorite(songElement);
		return;
	}

	const title = songElement.dataset.title;
	const url = songElement.dataset.url;
	playSong(title, url, songElement);
});



favorites.addEventListener("click", (event) => {
	const songElement = event.target.closest(".song-item");
	if (!songElement) return;

	const title = songElement.dataset.title;
	const url = songElement.dataset.url;
	playSong(title, url, songElement);
});




function toggleFavorite(songElement) {
	const title = songElement.dataset.title;
	const url = songElement.dataset.url;
	const displayName = songElement.textContent.trim();

	const existing = favorites.querySelector(`[data-title="${title}"]`);
	const heartIcon = songElement.querySelector(".fav-btn i");

	if (existing) {
		existing.remove();
		heartIcon.style.color = "#aaa"; 
	} else {

		const favSong = createSongElement(title, url, displayName, true);
		favorites.appendChild(favSong);
		heartIcon.style.color = "#ff69b4";
	}
}



document.getElementById("piche").addEventListener("click", () => {
	if (!currentSongElement) return;
	const prev = currentSongElement.previousElementSibling;

	if (prev && prev.classList.contains("song-item")) {
		playSong(prev.dataset.title, prev.dataset.url, prev);
	}
});

document.getElementById("age").addEventListener("click", () => {
	if (!currentSongElement) return;
	const next = currentSongElement.nextElementSibling;

	if (next && next.classList.contains("song-item")) {
		playSong(next.dataset.title, next.dataset.url, next);
	}
});

document.getElementById("muteBtn").addEventListener("click", () => {
	if (currentAudio) {
		currentAudio.muted = !currentAudio.muted;
		document.getElementById("muteBtn").innerHTML = currentAudio.muted ? "<i class='fas fa-volume-up'></i>" : "<i class='fas fa-volume-mute'></i>";
	}
});

document.getElementById("play-pause").addEventListener("click", () => {
	if (currentAudio) {
		if (currentAudio.paused) {
			currentAudio.play();
			document.getElementById("play-pause").innerHTML = "<i class='fas fa-pause'></i>";
		} else {
			currentAudio.pause();
			document.getElementById("play-pause").innerHTML = "<i class='fas fa-play'></i>";
		}
	}
});

document.getElementById("reset").addEventListener("click", () => {
	if (currentAudio) {
		currentAudio.currentTime = 0;
		currentAudio.play();
	}
});



document.getElementById("ban").addEventListener("click", () => {
	document.querySelector(".banner").style.display = "none";
});
document.getElementById('ham_1').addEventListener('click', () => {
	document.querySelector(".left").style.left = "0";
	ham_1.style.display = "none";
	ham_2.style.display = "block";
});
document.getElementById('ham_2').addEventListener('click', () => {
	document.querySelector(".left").style.left = "-100vw";
	ham_2.style.display = "none";
	ham_1.style.display = "block";
});




const uploadZone = document.getElementById("uploadZone");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");

if (uploadZone && fileInput && uploadBtn) {
	["dragenter", "dragover"].forEach(evt =>
		uploadZone.addEventListener(evt, (e) => {
			e.preventDefault();
			uploadZone.classList.add("dragover");
		})
	);
	["dragleave", "drop"].forEach(evt =>
		uploadZone.addEventListener(evt, (e) => {
			e.preventDefault();
			uploadZone.classList.remove("dragover");
		})
	);

	uploadZone.addEventListener("drop", (e) => {
		addUploadedSongs(Array.from(e.dataTransfer.files));
	});
	uploadBtn.addEventListener("click", () => fileInput.click());
	fileInput.addEventListener("change", (e) => {
		addUploadedSongs(Array.from(e.target.files));
		fileInput.value = "";
	});
}

function addUploadedSongs(files) {
	const mp3s = files.filter(f => /\.mp3$/i.test(f.name));
	if (mp3s.length === 0) {
		alert("Please choose an MP3 file.");
		return;
	}
	mp3s.forEach(file => {
		const url = URL.createObjectURL(file);
		const baseName = file.name.replace(/\.mp3$/i, "");
		const songDiv = createSongElement(baseName, url, file.name);
		library.appendChild(songDiv);
	});
}

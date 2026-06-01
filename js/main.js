"use strict";

// ── Populate text from config ────────────────────────────────────
document.getElementById("titleWeb").textContent = CONFIG.titleWeb;
document.getElementById("introTitle").textContent = CONFIG.introTitle;
document.getElementById("introDesc").textContent = CONFIG.introDesc;
document.getElementById("btnIntro").textContent = CONFIG.btnIntro;
document.getElementById("title").textContent = CONFIG.title;
document.getElementById("desc").textContent = CONFIG.desc;
document.getElementById("yes").textContent = CONFIG.btnYes;
document.getElementById("no").textContent = CONFIG.btnNo;
document.getElementById("finalTitle").textContent = CONFIG.finalTitle;
document.getElementById("finalSubtitle").textContent = CONFIG.finalSubtitle;
document.getElementById("finalCardLabel").textContent = CONFIG.finalCardLabel;
document.getElementById("btTitle").textContent = CONFIG.btTitle;
document.getElementById("btDesc").textContent = CONFIG.btDesc;
document.getElementById("bubbletea-input").placeholder = CONFIG.btPlaceholder;
document.getElementById("btnBubbletea").textContent = CONFIG.btBtn;

// ── Floating particles ───────────────────────────────────────────
var EMOJIS = ["💖", "💕", "✨", "🌸", "💝", "🫶", "🌷", "🧋"];

function spawnParticle() {
  var el = document.createElement("div");
  el.className = "particle";
  var size = (Math.random() * 13 + 9).toFixed(1);
  var duration = (Math.random() * 5 + 7).toFixed(1);
  var opacity = (Math.random() * 0.28 + 0.1).toFixed(2);
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.fontSize = size + "px";
  el.style.setProperty("--dur", duration + "s");
  el.style.setProperty("--op", opacity);
  document.getElementById("particles").appendChild(el);
  setTimeout(function () {
    el.remove();
  }, duration * 1000);
}

setInterval(spawnParticle, 700);

// ── Preloader ────────────────────────────────────────────────────
function dismissPreloader(cb) {
  var el = document.getElementById("preloader");
  el.classList.add("out");
  setTimeout(cb, 560);
}

// ── Modal helpers ────────────────────────────────────────────────
function openModal(id) {
  var el = document.getElementById(id);
  var card = el.querySelector(".glass-card");
  el.classList.remove("hidden", "out");
  el.style.display = "flex";
  // replay card entrance animation
  card.style.animation = "none";
  card.offsetHeight;
  card.style.animation = "";
}

function closeModal(id, cb) {
  var el = document.getElementById(id);
  el.classList.add("out");
  setTimeout(function () {
    el.classList.add("hidden");
    el.style.display = "none";
    el.classList.remove("out");
    if (cb) cb();
  }, 300);
}

// ── Button positions ─────────────────────────────────────────────
function positionButtons() {
  var W = $(window).width();
  var H = $(window).height();
  var yesW = $("#yes").outerWidth() || 160;
  var noW = $("#no").outerWidth() || 130;
  var xYes = (0.9 * W - yesW - noW) / 2;
  var xNo = xYes + yesW + 0.1 * W;
  var y = 0.74 * H;
  $("#yes").css({ left: xYes + "px", top: y + "px" });
  $("#no").css({ left: xNo + "px", top: y + "px" });
}

// ── Startup ──────────────────────────────────────────────────────
$(document).ready(function () {
  setTimeout(function () {
    dismissPreloader(function () {
      openModal("intro-modal");
    });
  }, 1000);
});

$("#btnIntro").on("click", function () {
  closeModal("intro-modal", function () {
    var content = document.getElementById("main-content");
    content.style.display = "block";
    requestAnimationFrame(positionButtons);
  });
});

// ── No button evasion ────────────────────────────────────────────
function btnOverlaps(ax, ay, aw, ah, bx, by, bw, bh) {
  var pad = 28;
  return (
    ax < bx + bw + pad &&
    ax + aw + pad > bx &&
    ay < by + bh + pad &&
    ay + ah + pad > by
  );
}

function switchButton() {
  var noPos = { left: $("#no").css("left"), top: $("#no").css("top") };
  $("#no").css({ left: $("#yes").css("left"), top: $("#yes").css("top") });
  $("#yes").css(noPos);
}

function moveButton() {
  new Audio("sound/Swish1.mp3").play().catch(function () {});
  var W = $(window).width();
  var H = $(window).height();
  var noW = $("#no").outerWidth();
  var noH = $("#no").outerHeight();
  var yesL = parseInt($("#yes").css("left")) || 0;
  var yesT = parseInt($("#yes").css("top")) || 0;
  var yesW = $("#yes").outerWidth();
  var yesH = $("#yes").outerHeight();
  var x,
    y,
    tries = 0;
  do {
    x = Math.random() * (W - noW - 16) + 8;
    y = Math.random() * (H - noH - 16) + 8;
    tries++;
  } while (tries < 30 && btnOverlaps(x, y, noW, noH, yesL, yesT, yesW, yesH));
  $("#no").css({ left: x + "px", top: y + "px" });
}

var noClickCount = 0;

$("#no").on("mouseenter", function () {
  if (noClickCount < 3) return;
  Math.random() < 0.35 ? switchButton() : moveButton();
});

$("#no").on("touchstart", function (e) {
  if (noClickCount < 3) return;
  e.preventDefault();
  Math.random() < 0.35 ? switchButton() : moveButton();
});

$("#no").on("click", function () {
  if (noClickCount < 3) {
    $(this).text(CONFIG.btnNoTexts[noClickCount]);
    var rawDesc = CONFIG.btnNoDescs[noClickCount];
    var htmlDesc = rawDesc.replace(
      "KOI Thé",
      '<span class="koi-highlight">KOI Thé</span>',
    );
    var caption = CONFIG.btnNoDogCaptions[noClickCount];
    var dogImg = CONFIG.btnNoDogImages[noClickCount];
    var descEl = document.getElementById("desc");
    descEl.classList.remove("desc-pop");
    descEl.offsetHeight;
    descEl.innerHTML =
      '<div class="desc-denial">' +
      '<img src="' + dogImg + '" class="desc-sad-dog" alt="">' +
      '<span class="desc-sad-caption">' +
      caption +
      "</span>" +
      '<span class="desc-sad-text">' +
      htmlDesc +
      "</span>" +
      "</div>";
    descEl.classList.add("desc-pop");
    noClickCount++;
    return;
  }
  if (screen.width >= 900) switchButton();
});

// ── Yes button → bubble tea order ────────────────────────────────
var bubbleteaChoice = "";

$("#yes").on("click", function () {
  new Audio("sound/tick.mp3").play().catch(function () {});
  document.getElementById("bubbletea-input").value = "";
  openModal("bubbletea-modal");
  //   // Auto-focus input after card animates in
  //   setTimeout(function () {
  //     document.getElementById("bubbletea-input").focus();
  //   }, 600);
});

$("#btnBubbletea").on("click", function () {
  var val = document.getElementById("bubbletea-input").value.trim();
  bubbleteaChoice = val || "gì anh mua cũng được 😊";
  // Instantly hide the modal — no fade, so there's no gap before the final screen
  var modal = document.getElementById("bubbletea-modal");
  modal.classList.add("hidden");
  modal.style.display = "none";
  showFinalScreen();
});

$("#bubbletea-input").on("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    $("#btnBubbletea").trigger("click");
  }
});

// ── Final screen ─────────────────────────────────────────────────
function showFinalScreen() {
  // Build plan items from config
  var list = document.getElementById("finalItems");
  list.innerHTML = "";
  CONFIG.finalItems.forEach(function (item) {
    var li = document.createElement("li");
    li.className = "final-item";
    li.innerHTML =
      '<span class="fi-icon">' +
      item[0] +
      "</span>" +
      '<span class="fi-text">' +
      item[1] +
      "</span>";
    list.appendChild(li);
  });

  // Personalise the bubble tea badge
  document.getElementById("bbtOrderValue").textContent = bubbleteaChoice;

  var el = document.getElementById("final-screen");
  el.classList.remove("hidden");
  el.style.display = "flex";
  el.style.animation = "none"; // solid from frame 1 — no opacity-0 flash; content children still animate

  // Burst of extra particles for the occasion
  var dense = setInterval(spawnParticle, 120);
  setTimeout(function () {
    clearInterval(dense);
  }, 2800);

  // Fireworks after the screen finishes fading in
  setTimeout(launchFireworks, 280);
}

// ── Fireworks (canvas) ───────────────────────────────────────────
function launchFireworks() {
  var canvas = document.getElementById("fireworks-canvas");
  var ctx = canvas.getContext("2d");
  var W = (canvas.width = window.innerWidth);
  var H = (canvas.height = window.innerHeight);
  var particles = [];

  var COLORS = [
    "#FF6B8A",
    "#FF4757",
    "#FF8FA3",
    "#FFD6DE",
    "#FF80AB",
    "#F50057",
    "#FF1744",
    "#ffffff",
  ];

  function burst(x, y, count, maxSpeed) {
    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 * i) / count + Math.random() * 0.55;
      var speed = Math.random() * maxSpeed + 2.5;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 1.5,
        life: 1,
        decay: Math.random() * 0.014 + 0.009,
        size: Math.random() * 6.5 + 2.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        type: Math.random() < 0.38 ? "spark" : "circle",
        rot: Math.random() * Math.PI * 2,
        rotSpd: (Math.random() - 0.5) * 0.13,
        gravity: 0.16 + Math.random() * 0.08,
      });
    }
  }

  var cx = W / 2,
    cy = H / 2;
  // Staggered bursts: centre first, then corners, then flanks
  setTimeout(function () {
    burst(cx, cy, 115, 12);
  }, 80);
  setTimeout(function () {
    burst(cx * 0.38, cy * 0.48, 60, 9);
  }, 420);
  setTimeout(function () {
    burst(cx * 1.62, cy * 0.48, 60, 9);
  }, 600);
  setTimeout(function () {
    burst(cx, cy * 1.45, 80, 10);
  }, 850);
  setTimeout(function () {
    burst(cx * 0.25, cy * 0.82, 45, 8);
  }, 1100);
  setTimeout(function () {
    burst(cx * 1.75, cy * 0.82, 45, 8);
  }, 1100);
  setTimeout(function () {
    burst(cx, cy, 55, 7);
  }, 1500);

  function drawSpark(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot + (1 - p.life) * 3.5);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = Math.max(0.5, p.size * 0.32);
    ctx.lineCap = "round";
    var r = p.size * 1.3;
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.stroke();
    ctx.restore();
  }

  var active = true;
  function animate() {
    if (!active) return;
    ctx.clearRect(0, 0, W, H);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.984;
      p.life -= p.decay;
      p.rot += p.rotSpd;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.life * p.life;
      ctx.fillStyle = p.color;

      if (p.type === "spark") {
        drawSpark(p);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, W, H);
      active = false;
    }
  }
  animate();
}

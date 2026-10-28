var foglalasok = JSON.parse(localStorage.getItem('foglalasok') || '[]');
var MAX_NAPI = 8;

function ment() {
  localStorage.setItem('foglalasok', JSON.stringify(foglalasok));
}

function uzen(szoveg) {
  document.getElementById('uzenet').textContent = szoveg;
}

function foglalt(ido) {
  return foglalasok.some(function(f) { return f.ido === ido; });
}

function rendezes() {
  foglalasok.sort(function (a, b) { return a.ido.localeCompare(b.ido); });
}

function render() {
  var lista = document.getElementById('lista');
  lista.innerHTML = '';
  foglalasok.forEach(function (f, i) {
    var sor = document.createElement('div');
    sor.className = 'sor';
    
    var span = document.createElement('span');
    span.textContent = f.ido + ' – ' + f.nev;
    
    var torol = document.createElement('span');
    torol.className = 'torol';
    torol.dataset.i = i;
    torol.textContent = 'Törlés';

    sor.appendChild(span);
    sor.appendChild(torol);
    lista.appendChild(sor);
  });
  document.querySelectorAll('.torol').forEach(function (el) {
    el.addEventListener('click', function () {
      foglalasok.splice(Number(el.dataset.i), 1);
      ment();
      render();
    });
  });
}

document.getElementById('f').addEventListener('submit', function (e) {
  e.preventDefault();
  var nev = document.getElementById('nev').value.trim();
  var ido = document.getElementById('ido').value;
  if (foglalasok.length >= MAX_NAPI) { uzen('Ma már nincs szabad hely.'); return; }
  if (foglalt(ido)) { uzen('Ez az időpont már foglalt.'); return; }
  foglalasok.push({ nev: nev, ido: ido });
  rendezes();
  ment();
  render();
  uzen('Foglalás rögzítve: ' + ido);
  this.reset();
});

render();
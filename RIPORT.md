# A rakoncátlan időpontfoglaló – hibariport

Repó: https://github.com/istszabi/umfst-bh02-idopontfoglalo
Készítette: Istok Szabolcs, Informatika LM III.év

## 1. hiba
- **Hiba leírása és reprodukálása:** Többször is le lehet foglalni ugyanazt az időpontot (pl. `09:00`), a rendszer egyáltalán nem jelzi, hogy már foglalt. Reprodukálás: beírsz egy nevet `09:00`-ra, beküldöd, majd még egyszer elküldöd ugyanezt a `09:00`-t egy másik névvel.
- **Gyökérok (sor + magyarázat):** 13. sor (`return foglalasok.indexOf(ido) !== -1;`). A `foglalasok` tömbben nem sima stringek, hanem objektumok vannak (`{nev, ido}`). Az `indexOf('09:00')` hívás objektumok között keres egy stringet, ami mindig `-1`-et ad vissza, mintha sosem lenne foglalt.
- **Javítás (commit link):** https://github.com/istszabi/umfst-bh02-idopontfoglalo/commit/b71eb96
- **Hogyan tesztelted (kézi tesztlépések, konzolos ellenőrzés vagy egységteszt):** Formból teszteltem kétszer ugyanazzal az időponttal, illetve DevTools konzolból közvetlenül lefuttattam a `foglalt('09:00')`-t létező elemre (így már `true`-t ad vissza).
- **Tanulság / érintett alapelv:** Adatszerkezetnek megfelelő JS metódus használata. Objektumok tömbjében nem `indexOf`-ot használunk, hanem `.some()` vagy `.find()` függvényt.

## 2. hiba
- **Hiba leírása és reprodukálása:** A napi limit 8 lenne, de a 9. foglalást is simán engedi a rendszer, csak a 10.-nél dob hibaüzenetet. Reprodukálás: felveszel 8 foglalást egymás után, majd megpróbálsz egy 9.-et is rögzíteni.
- **Gyökérok (sor + magyarázat):** 33. sor (`if (foglalasok.length > MAX_NAPI)`). Szigorú nagyobb (`>`) van a `>=` helyett. Amikor 8 elem van a tömbben, a `8 > 8` még `false`, így a 9. elem is átcsúszik az ellenőrzésen.
- **Javítás (commit link):** https://github.com/istszabi/umfst-bh02-idopontfoglalo/commit/b251754
- **Hogyan tesztelted (kézi tesztlépések, konzolos ellenőrzés vagy egységteszt):** Felvittem 8 próbafoglalást, majd a 9.-nél megnéztem, hogy kiírja-e a hibaüzenetet és nem kerül-e be a listába.
- **Tanulság / érintett alapelv:** Határértékek ellenőrzése (Off-by-one hiba). Korlátok vizsgálatánál pontosan kell megválasztani az relációs operátorokat (`>=` vs `>`).

## 3. hiba
- **Hiba leírása és reprodukálása:** A foglalások nem időrendben jelennek meg, pl. a `08:30`-as foglalás a `10:00`-s mögé kerül. Reprodukálás: felveszel egy foglalást `10:00`-ra, utána egyet `08:30`-ra.
- **Gyökérok (sor + magyarázat):** 17. sor (`foglalasok.sort(function (a, b) { return a.ido > b.ido; });`). A JS `.sort()` callback-je számot vár (-1, 0, 1), de az `a.ido > b.ido` egy booleant ad vissza, amitől a rendezés nem működik megbízhatóan.
- **Javítás (commit link):** https://github.com/istszabi/umfst-bh02-idopontfoglalo/commit/0a8d783
- **Hogyan tesztelted (kézi tesztlépések, konzolos ellenőrzés vagy egységteszt):** Összevissza időpontokat vettem fel (`14:00`, `08:00`, `10:30`), és ellenőriztem a DOM-ban, hogy sorrendben jelennek-e meg.
- **Tanulság / érintett alapelv:** JS API-k helyes használata. A `.sort()` összehasonlító függvényének elvárt visszatérési típusát pontosan követni kell (stringeknél `.localeCompare()`).

## 4. hiba
- **Hiba leírása és reprodukálása:** Névnek beírva egy HTML/JS kódot (pl. `<img src=x onerror="...">`), az kódként lefut a böngészőben. Reprodukálás: a név mezőbe beilleszted az img onerror payload-ot és elküldöd.
- **Gyökérok (sor + magyarázat):** 24–25. sor (`lista.innerHTML += ...`). A beviteli mezőből származó nyers string közvetlenül be van fűzve az `innerHTML`-be, ami tárolt XSS sérülékenységhez vezet.
- **Javítás (commit link):** https://github.com/istszabi/umfst-bh02-idopontfoglalo/commit/322456e
- **Hogyan tesztelted (kézi tesztlépések, konzolos ellenőrzés vagy egységteszt):** Beküldtem egy HTML/script injekciót a név mezőben, és csekkoltam, hogy sima szövegként jelenik meg az oldalon a script lefutása helyett.
- **Tanulság / érintett alapelv:** Webes biztonság (XSS megelőzés). Felhasználói inputot soha nem pakolunk nyersen `innerHTML`-be, helyette `createElement` + `textContent` kell.

## 5. hiba
- **Hiba leírása és reprodukálása:** Billentyűzettel (Tab) nem lehet rálépni a Törlés opcióra, és Enterrel sem indítható el a törlés. Reprodukálás: próbálj meg csak billentyűzettel törölni egy elemet a listából.
- **Gyökérok (sor + magyarázat):** 25. sor (`'<span class="torol"...'`). Sima `<span>` elemet használtak gomb helyett, aminek nincs fókuszállapota és nem kezel billentyűeseményeket.
- **Javítás (commit link):** https://github.com/istszabi/umfst-bh02-idopontfoglalo/commit/e7bd776
- **Hogyan tesztelted (kézi tesztlépések, konzolos ellenőrzés vagy egységteszt):** Tab-bal végignavigáltam az oldalon egér nélkül, majd Enter megnyomásával töröltem a kijelölt foglalást.
- **Tanulság / érintett alapelv:** Semantikus HTML / Akadálymentesítés (a11y). Ami gombként funkcionál, ahhoz interaktív `<button>` elemet használunk.

## 6. hiba
- **Hiba leírása és reprodukálása:** Sok foglalásnál (50+) kifejezetten szaggat/lassú a lista újrarajzolása. Reprodukálás: több elem felvitele után a törlés vagy új hozzáadás érezhetően akad.
- **Gyökérok (sor + magyarázat):** 23–28. sor. Ciklusban van összefűzve az `innerHTML +=`, ami minden elemnél újraépíti a teljes DOM-ot, plusz minden renderkor újra fel vannak iratkoztatva az event listener-ek.
- **Javítás (commit link):** https://github.com/istszabi/umfst-bh02-idopontfoglalo/commit/438418c
- **Hogyan tesztelted (kézi tesztlépések, konzolos ellenőrzés vagy egységteszt):** DevTools Performance fülön mértem a renderelési időt 100 elemmel, illetve `console.time('render')`-el ellenőriztem az optimális futást.
- **Tanulság / érintett alapelv:** DOM teljesítmény és eseménydelegálás. Ciklusos DOM módosítás helyett `DocumentFragment`-et érdemes használni, és listener-ek halmozása helyett a szülő elemre delegálunk.

## Összegzés
- **Mit tanultam:** A logikai hibák javításán kívül mindig figyelni kell a biztonsági résekre (XSS), a semantikus elemek használatára az akadálymentesítés miatt, meg arra is, hogy a felesleges DOM újraépítések ne lassítsák be az alkalmazást.
- **Melyik alapelv sérült a leggyakrabban:** A beépített JS metódusok és típusok nem megfelelő használata (`indexOf` objektumokon, hibás `.sort()` callback), valamint a nem biztonságos DOM kezelés (`innerHTML` injekció).
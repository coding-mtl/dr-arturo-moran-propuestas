const design = Number(document.body.dataset.design);
const asset = name => `../assets/${name}.webp`;
const wa = 'https://wa.me/5218122010912';
const icon = (name, cls = '') => {
  const paths = {
    pin: '<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="m5 3 4 1 1 5-3 2a16 16 0 0 0 6 6l2-3 5 1 1 4c-1 4-7 2-12-3S2 4 5 3Z"/>',
    shield: '<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8 12 3 3 5-6"/>',
    chat: '<path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z"/><path d="M8 10h8M8 14h5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
  };
  return `<svg class="icon ${cls}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.plus}</svg>`;
};
const c = {
  intro: 'Especialista en Cirugía de rodilla у hombro, con mas de 20 años de experiencia en cirugía ortopédia, artroscopia y protesis de rodilla y cadera.',
  bio: 'El Dr. Arturo Moran Vidaurri, es traumatólogo certificado por el Consejor de Ortopedia y Traumatología de México, con 20 años de experiencia en Ortopedia y Traumatología, además de haber realizado la Subespecialdiad en Cirugía Artroscópica de Rodilla y Hombro, para la atención integral de Lesiones Deportivas de rodilla y hombro.',
  bio2: 'También realizó entrenamiento para la atención de problemas derivados de desgaste articular, para el tratamiento de lesiones de cartílago y especialista en cirugía de protesis de rodilla y cadera para la atención de dolor de cadera por artrosis o desgaste de cartílago.',
  recovery: 'Atención especializada en lesiones de rodilla, hombro y cadera, con diagnóstico preciso, técnicas quirúrgicas avanzadas y seguimiento personalizado para ayudarte a recuperar movilidad y calidad de vida.',
};
const services = [
  { name: 'Lesiones de Rodilla', label: 'Rodilla', type: 'Artroscopia de Rodilla', url: 'lesiones-de-rodilla', desc: 'Las lesiones de rodilla pueden presentarse durante actividades deportivas, caídas, accidentes o movimientos bruscos de rotación.' },
  { name: 'Lesiones de Hombro', label: 'Hombro', type: 'Artroscopia de Hombro', url: 'lesiones-de-hombro', desc: 'Las lesiones de hombro pueden presentarse por caídas, luxaciones, movimientos bruscos, sobreesfuerzo deportivo o desgaste progresivo de los tendones.' },
  { name: 'Prótesis de Cadera', label: 'Cadera', type: 'Prótesis de Cadera', url: 'protesis-de-cadera', desc: 'La artrosis de cadera es el desgaste progresivo del cartílago articular, lo que puede provocar dolor, rigidez, dificultad para caminar y limitación para realizar actividades cotidianas.' },
];
const button = (text = 'Programa tu Cita', style = '') => `<a class="button ${style}" href="${wa}" target="_blank" rel="noopener">${icon('chat')}${text}</a>`;
const locationMarkup = `<span class="location">${icon('pin')} OCA Medical Center · Monterrey, N.L.</span>`;
function header() {
 return `<a class="skip" href="#contenido">Saltar al contenido</a><div class="topline"><div class="container">${locationMarkup}<a href="tel:+528122010912">${icon('phone')} 81 2201 0912</a></div></div><div class="header-shell"><header class="site-header container"><a class="brand" href="#inicio" aria-label="Dr. Arturo Morán Vidaurri, inicio"><img src="${asset('logo')}" width="190" height="109" alt="Dr. Arturo Moran Vidaurri · Traumatologo Ortopedista | Cirujano de Rodilla y Hombro"></a><nav id="main-nav" aria-label="Navegación principal"><a href="#doctor">El doctor</a><a href="#especialidades">Especialidades</a><a href="#videos">Videos</a><a href="#contacto">Contacto</a></nav><a class="nav-appointment" href="${wa}" target="_blank" rel="noopener">Agenda tu cita ${icon('plus')}</a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Abrir menú">${icon('menu')}</button></header></div>`;
}
function hero1() {
 return `<section class="hero hero-one container" id="inicio"><div class="hero-copy"><p class="eyebrow">TRAUMATÓLOGO ORTOPEDISTA · MONTERREY</p><h1 class="brand-title">Dr. Arturo Morán<br>Vidaurri.<span class="brand-tagline">Cirugía de rodilla y hombro</span></h1><div class="short-rule"></div><p class="lead">${c.intro}</p><div class="hero-actions">${button()}<a class="text-link" href="#doctor">Conoce al doctor</a></div><div class="hero-location">${icon('pin')}<span>OCA Medical Center<small>Consultorio 204 · Monterrey, Nuevo León</small></span></div></div><div class="hero-image-one"><div class="portrait-ground"></div><img class="hero-portrait" src="${asset('doctor-seated')}" alt="Dr. Arturo Morán Vidaurri con bata médica" width="1400" height="2048" fetchpriority="high"><div class="experience-card"><span class="experience-number">20<span>+</span></span><span>años de experiencia<small>Ortopedia y Traumatología</small></span></div></div></section><div class="trust-strip"><div class="container"><div>${icon('shield')}<span>Traumatólogo certificado</span></div><div>${icon('plus')}<span>Cirugía Artroscópica de Rodilla y Hombro</span></div><div>${icon('pin')}<span>OCA Medical Center</span></div></div></div>`;
}
function hero2() {
 return `<section class="hero hero-two container" id="inicio"><div class="editorial-heading"><p class="eyebrow">TRAUMATÓLOGO ORTOPEDISTA · MONTERREY</p><h1 class="brand-title">Dr. Arturo Morán Vidaurri.<span class="brand-tagline">Cirugía de rodilla y hombro</span></h1></div><div class="editorial-stage"><div class="editorial-left"><span class="editorial-number">20<span>+</span></span><p>años de experiencia<br>en Ortopedia y Traumatología</p><div class="editorial-rule"></div>${icon('shield')}<h2>Traumatólogo<br>certificado</h2><p>Cirugía Artroscópica<br>de Rodilla y Hombro</p></div><figure class="editorial-photo"><img src="${asset('doctor-seated')}" alt="Dr. Arturo Morán Vidaurri en su consultorio" width="1400" height="2048" fetchpriority="high"></figure><div class="editorial-right"><p class="eyebrow">ALTA ESPECIALIDAD</p><p class="lead">${c.intro}</p>${button()}<div class="editorial-location">${icon('pin')}<p>OCA Medical Center<small>Consultorio 204<br>Monterrey, Nuevo León</small></p></div></div></div></section>`;
}
function hero3() {
 return `<section class="hero hero-three" id="inicio"><div class="container hero-three-grid"><div class="hero-copy"><p class="eyebrow">TRAUMATÓLOGO ORTOPEDISTA · MONTERREY</p><h1 class="brand-title">Dr. Arturo Morán<br>Vidaurri.<span class="brand-tagline">Cirugía de rodilla y hombro</span></h1><p class="lead">${c.intro}</p><div class="hero-actions">${button('Programa tu Cita', 'button-light')}<a class="text-link" href="#especialidades">Especialidades</a></div></div><figure class="hero-three-photo"><img src="${asset('doctor-seated')}" alt="Retrato del Dr. Arturo Morán Vidaurri" width="1400" height="2048" fetchpriority="high"><figcaption>${icon('shield')}<span>Traumatólogo certificado<small>Ortopedia y Traumatología</small></span></figcaption></figure><div class="hero-three-bottom"><div><strong>20<span>+</span></strong><span>años de experiencia<br>en cirugía ortopédia</span></div><div>${icon('pin')}<span>OCA Medical Center<small>Consultorio 204 · Monterrey</small></span></div><a href="tel:+528122010912">${icon('phone')}<span>Tel. Consultorio y Whatsapp<small>81 2201 0912</small></span></a></div></div></section>`;
}
function specialities() {
 const intro = `<div class="section-heading"><div><p class="eyebrow">SUBESPECIALIDAD EN:</p><h2>Servicios Médicos<br><span>Especializados</span></h2></div><p>Alta Especialidad en Cirugía de Rodilla, Hombro y cadera</p></div>`;
 return `<section class="specialities section container" id="especialidades">${intro}<div class="service-grid">${services.map((s, i) => `<article class="service-card"><div class="service-card-top"><span class="service-number">0${i+1}</span><span class="service-mark service-mark-${i}" aria-hidden="true"><img src="${asset('symbol')}" alt=""></span></div><h3>${s.name}</h3><p>${s.desc}</p><a class="service-link" href="https://rodillayhombro.com.mx/${s.url}/" target="_blank" rel="noopener"><span>${s.type}</span>${icon('plus')}</a></article>`).join('')}</div></section>`;
}
function doctor() {
 const src = 'doctor-scrubs';
 return `<section class="doctor-section" id="doctor"><div class="container doctor-grid"><figure class="doctor-photo"><img src="${asset(src)}" alt="Dr. Arturo Morán Vidaurri" loading="lazy"></figure><div class="doctor-copy"><p class="eyebrow">EL DOCTOR</p><h2>Conoce al<br><span>Dr. Morán.</span></h2><p>${c.bio}</p><p>${c.bio2}</p><div class="doctor-signoff">${icon('shield')}<span>Cirugía Artroscópica de Rodilla y Hombro</span></div>${button()}</div></div></section>`;
}

function clinicalMedia() {
 const videos = [{id:'9cpfNmI07B4',poster:'video-knee-1.jpg',title:'Procedimiento 1'},{id:'fZy02dDj3pg',poster:'video-knee-2.jpg',title:'Procedimiento 2'}];
 return `<section class="clinical-section"><div class="container"><div class="section-heading"><div><p class="eyebrow">CIRUGÍA ORTOPÉDICA DE ALTA ESPECIALIDAD</p><h2>Tratamientos Enfocados<br><span>en tu Recuperación</span></h2></div></div><div class="clinical-feature"><figure class="clinical-photo"><img src="${asset('clinical-shoulder')}" alt="Dr. Arturo Morán durante una cirugía artroscópica" loading="lazy"><figcaption>${icon('shield')}<span>Cirugía Artroscópica<small>Rodilla y Hombro</small></span></figcaption></figure><div class="care-path"><p class="eyebrow">TU ATENCIÓN</p><ol><li><span>01</span><h3>Diagnóstico preciso</h3><p>Lesiones de rodilla, hombro y cadera.</p></li><li><span>02</span><h3>Técnicas quirúrgicas avanzadas</h3><p>Artroscopia y prótesis de rodilla y cadera.</p></li><li><span>03</span><h3>Seguimiento personalizado</h3><p>Para recuperar movilidad y calidad de vida.</p></li></ol>${button('Programa tu Cita', design === 3 ? 'button-light' : '')}</div></div><div class="video-heading" id="videos"><p class="eyebrow">VIDEOS DEL DR. ARTURO MORÁN</p><h2>Artroscopia de Rodilla</h2><p class="clinical-disclosure">Imágenes de procedimientos quirúrgicos.</p></div><div class="video-grid">${videos.map((v,i)=>`<article class="video-card"><div class="video-player"><button class="video-launch" data-video="${v.id}" aria-label="Reproducir video ${i+1}: ${v.title}"><img src="../assets/${v.poster}" alt="" loading="lazy"><span class="play-circle" aria-hidden="true">▶</span><span class="video-label">Ver procedimiento</span></button></div><div class="video-caption"><h3>${v.title}</h3><a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Ver en YouTube</a></div></article>`).join('')}</div></div></section>`;
}

function insurance() {
 const names = [['gnp','GNP'],['axa','AXA'],['metlife','MetLife'],['mapfre','Mapfre'],['bbva','BBVA'],['monterrey','Seguros Monterrey'],['plan-seguro','Plan Seguro'],['bupa','Bupa']];
 return `<section class="insurance container"><p class="eyebrow">SEGUROS DE GASTOS MÉDICOS MAYORES EN CONVENIO</p><div class="insurer-logos">${names.map(([file,alt])=>`<img src="${asset(file)}" alt="${alt}" loading="lazy" width="110" height="58">`).join('')}</div></section>`;
}
function contact() {
 return `<section class="contact-section" id="contacto"><div class="container contact-grid"><div><p class="eyebrow">OCA MEDICAL CENTER · MONTERREY</p><h2>Programa<br><span>tu Cita.</span></h2><a class="contact-number" href="tel:+528122010912">81 2201 0912</a></div><div class="contact-details">${icon('pin')}<h3>Consultorio 204.</h3><p>Av. Pino Suarez 640, Consultorio 204.<br>Col. Centro, Monterrey. Nuevoleon<br>México.</p>${button('Escribenos', design===3 ? '' : 'button-light')}<a class="map-link" href="https://maps.google.com/maps?q=dr.%20Arturo%20moran" target="_blank" rel="noopener">Ver ubicación en Google Maps</a></div></div></section><footer class="site-footer container"><img src="${asset('logo')}" width="150" height="86" alt="Dr. Arturo Morán Vidaurri"><p>Cirugía de rodilla y hombro<br><span>Monterrey, Nuevo León</span></p><a href="#inicio">Volver al inicio</a></footer>`;
}
function dock() {
 const labels = ['Claridad clínica','Prestigio editorial','Autoridad contemporánea'];
 return `<aside class="design-dock" aria-label="Comparar propuestas"><a href="../" class="dock-index" aria-label="Ver todas las propuestas">Propuestas</a><div class="dock-options">${labels.map((label,i)=>`<a href="../propuesta-${i+1}/" ${i+1===design?'aria-current="page"':''} aria-label="Propuesta ${i+1}: ${label}">0${i+1}</a>`).join('')}</div><span class="dock-name">${labels[design-1]}</span><button class="dock-close" aria-label="Ocultar selector de propuestas">${icon('close')}</button></aside>`;
}
document.getElementById('app').innerHTML = header() + `<main id="contenido">${[hero1,hero2,hero3][design-1]()}${design===2 ? specialities()+doctor() : design===3 ? doctor()+specialities() : specialities()+doctor()}${clinicalMedia()}${insurance()}${contact()}</main>` + (new URLSearchParams(location.search).has('clean')?'':dock());
const menu = document.querySelector('.menu-toggle');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  menu.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
  menu.innerHTML = icon(expanded ? 'menu' : 'close');
  document.querySelector('.site-header').classList.toggle('menu-open', !expanded);
});
document.querySelectorAll('#main-nav a').forEach(a=>a.addEventListener('click',()=>{if(menu.getAttribute('aria-expanded')==='true')menu.click();}));
document.addEventListener('keydown', e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});
document.querySelector('.dock-close')?.addEventListener('click',()=>document.querySelector('.design-dock').remove());
if (location.protocol === 'file:') document.querySelectorAll('a[href$="/"]').forEach(a => { if (!a.getAttribute('href').startsWith('http')) a.setAttribute('href', a.getAttribute('href') + 'index.html'); });

document.querySelectorAll('.video-launch').forEach(button => button.addEventListener('click', () => {
 const frame = document.createElement('iframe');
 frame.src = 'https://www.youtube-nocookie.com/embed/' + button.dataset.video + '?autoplay=1&rel=0';
 frame.title = button.getAttribute('aria-label');
 frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
 frame.allowFullscreen = true;
 frame.referrerPolicy = 'strict-origin-when-cross-origin';
 button.parentElement.replaceChildren(frame);
 frame.focus();
}));

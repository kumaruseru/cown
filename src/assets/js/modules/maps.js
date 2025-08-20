// --- 3D Cosmic Background Script ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 1;
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('cosmic-bg'),
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Create starfield
const starGeo = new THREE.BufferGeometry();
const starCount = 6000;
const posArray = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 600;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starMaterial = new THREE.PointsMaterial({
    size: 0.5,
    color: 0xaaaaaa,
    transparent: true,
});
const stars = new THREE.Points(starGeo, starMaterial);
scene.add(stars);

// Mouse move interaction
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Animation loop
const clock = new THREE.Clock();
const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    stars.rotation.y = -mouseX * 0.00005;
    stars.rotation.x = -mouseY * 0.00005;
    // Parallax effect on scroll
    camera.position.z = 1 + (document.documentElement.scrollTop || document.body.scrollTop) * 0.001;
    renderer.render(scene, camera);
};
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Leaflet Map Initialization ---
const map = L.map('map', {
    zoomControl: false // Disable the default zoom control
}).setView([10.762622, 106.660172], 13); // Centered on Ho Chi Minh City

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- Friend Data & Markers ---
const friends = [
    { name: 'Cosmo Explorer', lat: 10.7769, lon: 106.7009, avatar: 'https://placehold.co/64x64/8A2BE2/FFFFFF?text=C', color: '#a855f7', location: 'Tại Đài thiên văn', speed: 5, battery: 80, time: '15 phút' },
    { name: 'Galaxy Gazer', lat: 10.75, lon: 106.66, avatar: 'https://placehold.co/64x64/00BFFF/FFFFFF?text=G', color: '#38bdf8', location: 'Đang ở nhà', speed: 0, battery: 95, time: '3 giờ' },
    { name: 'Starlight', lat: 10.78, lon: 106.68, avatar: 'https://placehold.co/64x64/FFAA00/FFFFFF?text=S', color: '#f59e0b', location: 'Quán cà phê Stardust', speed: 0, battery: 55, time: '2 giờ trước' }
];

const friendsListContainer = document.getElementById('friends-list');

// Loop through friends to create map markers and list items
friends.forEach(friend => {
    // Create custom icon for the map marker
    const customIcon = L.divIcon({
        className: 'custom-map-icon-container',
        html: `<img src="${friend.avatar}" class="custom-map-icon" style="border-color: ${friend.color};">`,
        iconSize: [48, 48],
        iconAnchor: [24, 48]
    });
    
    // Create popup content for the marker
    const popupContent = `
        <div class="text-center">
            <b class="text-lg">${friend.name}</b><br>
            ${friend.location}<br>
            ${friend.speed > 0 ? `Di chuyển: ${friend.speed} km/h` : `Dừng • ${friend.time}`}<br>
            Pin: ${friend.battery}%
        </div>
    `;

    // Add marker to the map
    L.marker([friend.lat, friend.lon], {icon: customIcon})
        .addTo(map)
        .bindPopup(popupContent);

    // Create a list item for the sidebar
    const friendElement = document.createElement('div');
    friendElement.className = `flex items-center justify-between ${friend.time.includes('trước') ? 'opacity-60' : ''}`;
    friendElement.innerHTML = `
        <div class="flex items-center gap-3">
            <img src="${friend.avatar}" alt="User Avatar" class="w-12 h-12 rounded-full"/>
            <div>
                <p class="font-semibold text-white">${friend.name}</p>
                <p class="text-xs text-gray-400">
                    ${friend.speed > 0 ? `Đang di chuyển - ${friend.speed} km/h` : `${friend.location} • ${friend.time}`}
                </p>
            </div>
        </div>
        <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">${friend.battery}%</span>
                <button class="p-2 rounded-full hover:bg-purple-500/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"/><path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"/><path d="m18.5 8.5 3.5 3.5-3.5 3.5-3.5-3.5 3.5-3.5Z"/><path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"/></svg>
                </button>
        </div>
    `;
    friendsListContainer.appendChild(friendElement);
});

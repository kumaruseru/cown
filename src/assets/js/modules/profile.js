// --- Main React App Component ---
const App = () => {
    return (
        <div className="relative z-10 container mx-auto grid grid-cols-12 gap-8 px-4 py-8">
            {/* Left Sidebar Navigation */}
            <aside className="col-span-12 lg:col-span-3 h-fit sticky top-8">
                <div className="glass-pane p-4 rounded-2xl space-y-2">
                    {/* User Info */}
                    <a href="#" className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
                        <img src="https://placehold.co/48x48/4F46E5/FFFFFF?text=A" alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-indigo-500"/>
                        <div>
                            <h3 className="font-bold text-lg text-white">Alex Starr</h3>
                            <p className="text-sm text-gray-400">@alexstarr</p>
                        </div>
                    </a>
                    <hr className="border-gray-700/50"/>
                    
                    {/* Navigation Links */}
                    <nav className="flex flex-col space-y-2">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold hover:bg-gray-800/50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            <span>Trang chủ</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <span>Khám phá</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <span>Tin nhắn</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>Bản đồ</span>
                        </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold bg-gray-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <span>Hồ sơ</span>
                        </a>
                    </nav>
                    <hr className="border-gray-700/50 pt-2"/>
                    
                    {/* Logout Button */}
                    <button className="w-full logout-button font-bold py-3 rounded-lg flex items-center justify-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="col-span-12 lg:col-span-9 space-y-6">
                {/* Profile Header */}
                <div className="glass-pane rounded-2xl">
                    <div>
                        <div className="h-48 md:h-64 bg-cover bg-center rounded-t-2xl" style={{backgroundImage: "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')"}}></div>
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <img src="https://placehold.co/128x128/4F46E5/FFFFFF?text=A" alt="User Avatar" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-900 -mt-16 sm:-mt-20"/>
                                <button className="secondary-button px-4 py-2 rounded-full font-semibold text-sm">Chỉnh sửa hồ sơ</button>
                            </div>
                            <div className="mt-2">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">Alex Starr</h2>
                                <p className="text-sm text-gray-400">@alexstarr</p>
                            </div>
                            <p className="mt-4 text-gray-300">Nhà du hành vũ trụ | Nhiếp ảnh gia thiên văn | Người mơ mộng giữa các vì sao.</p>
                            <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                                    <span>Tham gia tháng 8, 2025</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 mt-4 text-sm">
                                <p><span className="font-bold text-white">1,258</span> <span className="text-gray-400">Đang theo dõi</span></p>
                                <p><span className="font-bold text-white">5,432</span> <span className="text-gray-400">Người theo dõi</span></p>
                            </div>
                        </div>
                    </div>
                    {/* Profile Tabs */}
                    <div className="border-t border-gray-700/50 flex">
                        <button className="flex-1 p-4 font-semibold text-white relative">
                            Bài viết
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-blue-500 rounded-full"></div>
                        </button>
                        <button className="flex-1 p-4 font-semibold text-gray-400 hover:bg-gray-800/50 transition-colors">Phương tiện</button>
                        <button className="flex-1 p-4 font-semibold text-gray-400 hover:bg-gray-800/50 transition-colors">Lượt thích</button>
                    </div>
                </div>

                {/* Feed / Posts */}
                <div className="glass-pane p-4 rounded-2xl">
                        <div className="flex flex-col gap-4">
                            {/* Post 1 */}
                            <div className="bg-gray-800/30 rounded-lg overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src="https://placehold.co/40x40/4F46E5/FFFFFF?text=A" alt="User Avatar" className="w-10 h-10 rounded-full"/>
                                        <div>
                                            <h4 className="font-bold text-white">Alex Starr</h4>
                                            <p className="text-xs text-gray-400">2 giờ trước</p>
                                        </div>
                                    </div>
                                    <p>Vừa chụp được một bức ảnh tuyệt đẹp của Tinh vân Orion qua kính thiên văn mới. Vũ trụ thật kỳ diệu!</p>
                                    <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop" alt="Orion Nebula" className="mt-4 w-full h-auto rounded-xl border border-gray-700/50"/>
                                </div>
                                <div className="flex justify-around p-2 border-t border-gray-700/50">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                        <span>1.2k</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        <span>345</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                                        <span>189</span>
                                    </button>
                                </div>
                            </div>
                            {/* Post 2 */}
                            <div className="bg-gray-800/30 rounded-lg overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src="https://placehold.co/40x40/4F46E5/FFFFFF?text=A" alt="User Avatar" className="w-10 h-10 rounded-full"/>
                                        <div>
                                            <h4 className="font-bold text-white">Alex Starr</h4>
                                            <p className="text-xs text-gray-400">Hôm qua</p>
                                        </div>
                                    </div>
                                    <p>Bầu trời đêm nay thật trong xanh. Một cơ hội tuyệt vời để ngắm nhìn Dải Ngân Hà.</p>
                                </div>
                                <div className="flex justify-around p-2 border-t border-gray-700/50">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                        <span>25</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        <span>12</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                                        <span>3</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                </div>
            </main>
        </div>
    );
}

// Render the React app
ReactDOM.render(<App />, document.getElementById('root'));

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

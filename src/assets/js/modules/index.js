// --- React Components ---

// Popup for creating a new post
const CreatePostPopup = ({ closePopup }) => {
    const [postText, setPostText] = React.useState('');

    return (
        <div className="popup-overlay" onClick={closePopup}>
            <div className="glass-pane popup-content rounded-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center p-4 border-b border-gray-700/50 relative">
                    <h2 className="text-xl font-bold text-white">Tạo bài viết</h2>
                    <button onClick={closePopup} className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600/80 rounded-full p-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex items-center gap-4">
                        <img src="https://placehold.co/48x48/4F46E5/FFFFFF?text=A" alt="User Avatar" className="w-12 h-12 rounded-full"/>
                        <div>
                            <h3 className="font-bold text-lg text-white">Alex Starr</h3>
                            <p className="text-sm text-gray-400">@alexstarr</p>
                        </div>
                    </div>
                    <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder="Phi hành gia, bạn đang nghĩ gì?"
                        className="popup-textarea w-full h-32"
                    />
                </div>
                <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between p-3 border border-gray-700/50 rounded-lg">
                        <span className="font-semibold">Thêm vào bài viết</span>
                        <div className="flex items-center gap-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:stroke-white transition"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:stroke-white transition"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:stroke-white transition"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:stroke-white transition"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                    </div>
                    <button disabled={!postText.trim()} className="w-full main-button font-bold py-3 rounded-lg">Đăng</button>
                </div>
            </div>
        </div>
    );
};

// Component for the main home feed
const HomeFeed = ({ openPopup }) => (
    <>
        <div className="glass-pane p-4 rounded-2xl">
            <div className="flex items-center gap-4">
                <img src="https://placehold.co/48x48/4F46E5/FFFFFF?text=A" alt="User Avatar" className="w-12 h-12 rounded-full"/>
                <div onClick={openPopup} className="w-full bg-gray-800/50 border border-gray-700/60 rounded-full px-4 py-3 text-gray-400 cursor-pointer hover:bg-gray-700/50 transition">
                    Phi hành gia, bạn đang nghĩ gì?
                </div>
            </div>
        </div>
        <div className="glass-pane rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center gap-4">
                <img src="https://placehold.co/48x48/8A2BE2/FFFFFF?text=C" alt="User Avatar" className="w-12 h-12 rounded-full"/>
                <div>
                    <h4 className="font-bold text-white">Cosmo Explorer</h4>
                    <p className="text-xs text-gray-400">@cosmo_exp · 2 giờ trước</p>
                </div>
            </div>
            <div className="px-4 pb-4 space-y-4">
                <p>Vừa chụp được một bức ảnh tuyệt đẹp của Tinh vân Orion qua kính thiên văn mới. Vũ trụ thật kỳ diệu! ✨ #astrophotography #space</p>
                <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop" alt="Orion Nebula" className="w-full h-auto rounded-xl border border-gray-700/50"/>
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
    </>
);

// Component for the discovery page content
const DiscoveryPage = () => (
    <>
        <div className="glass-pane p-4 rounded-2xl flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Tìm kiếm trong vũ trụ..." className="w-full bg-transparent text-white text-lg focus:outline-none"/>
        </div>
        <div className="glass-pane p-4 rounded-2xl">
            <h3 className="font-bold text-lg text-white mb-4">Thịnh hành</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <img src="https://images.unsplash.com/photo-1506703109124-385258545933?q=80&w=1974&auto=format&fit=crop" alt="Galaxy" className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-80 transition-opacity"/>
                <img src="https://images.unsplash.com/photo-1543722530-533b3723236f?q=80&w=1964&auto=format&fit=crop" alt="Nebula" className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-80 transition-opacity"/>
                <img src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop" alt="Stars" className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-80 transition-opacity"/>
            </div>
        </div>
    </>
);

// Component for the maps page content
const MapsPage = () => (
    <>
        <div className="glass-pane p-4 rounded-2xl flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Tìm kiếm địa điểm, thành phố..." className="w-full bg-transparent text-white text-lg focus:outline-none"/>
        </div>
        <div className="glass-pane rounded-2xl overflow-hidden h-[calc(100vh-12rem)]">
            <div className="w-full h-full bg-cover bg-center opacity-50" style={{backgroundImage: "url('https://placehold.co/1200x800/090a0f/00BFFF?text=Cosmic+Map+Interface')"}}>
            </div>
        </div>
    </>
);

// Component for the right sidebar
const RightSidebar = () => (
    <aside className="col-span-12 lg:col-span-4 h-fit sticky top-8 space-y-6 right-sidebar">
        <div className="glass-pane p-4 rounded-2xl">
            <h3 className="font-bold text-lg text-white mb-4">Gợi ý cho bạn</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="https://placehold.co/40x40/8A2BE2/FFFFFF?text=C" alt="User Avatar" className="w-10 h-10 rounded-full"/>
                        <div>
                            <p className="font-semibold text-white">Cosmo Explorer</p>
                            <p className="text-xs text-gray-400">@cosmo_exp</p>
                        </div>
                    </div>
                    <button className="secondary-button px-4 py-1.5 rounded-full font-semibold text-sm">Theo dõi</button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="https://placehold.co/40x40/00BFFF/FFFFFF?text=G" alt="User Avatar" className="w-10 h-10 rounded-full"/>
                        <div>
                            <p className="font-semibold text-white">Galaxy Gazer</p>
                            <p className="text-xs text-gray-400">@gazer_g</p>
                        </div>
                    </div>
                    <button className="secondary-button px-4 py-1.5 rounded-full font-semibold text-sm">Theo dõi</button>
                </div>
            </div>
        </div>
    </aside>
);

// Main App Component that handles routing
const App = () => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState('home');

    // Function to render the correct page based on state
    const renderPage = () => {
        switch(currentPage) {
            case 'discovery':
                return <DiscoveryPage />;
            case 'maps':
                return <MapsPage />;
            case 'home':
            default:
                return <HomeFeed openPopup={() => setIsPopupOpen(true)} />;
        }
    };

    return (
        <>
            <canvas id="cosmic-bg"></canvas>
            
            {isPopupOpen && <CreatePostPopup closePopup={() => setIsPopupOpen(false)} />}

            <div className="relative z-10 container mx-auto grid grid-cols-12 gap-8 px-4 py-8">
                {/* Left Sidebar */}
                <aside className="col-span-12 lg:col-span-3 h-fit sticky top-8">
                    <div className="glass-pane p-4 rounded-2xl space-y-2">
                        <a href="#" className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
                            <img src="https://placehold.co/48x48/4F46E5/FFFFFF?text=A" alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-indigo-500"/>
                            <div>
                                <h3 className="font-bold text-lg text-white">Alex Starr</h3>
                                <p className="text-sm text-gray-400">@alexstarr</p>
                            </div>
                        </a>
                        <hr className="border-gray-700/50"/>
                        <nav className="flex flex-col space-y-2">
                            <a href="#" onClick={() => setCurrentPage('home')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${currentPage === 'home' ? 'text-white bg-gray-500/20' : 'hover:bg-gray-800/50'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                <span>Trang chủ</span>
                            </a>
                            <a href="#" onClick={() => setCurrentPage('discovery')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${currentPage === 'discovery' ? 'text-white bg-gray-500/20' : 'hover:bg-gray-800/50'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                <span>Khám phá</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                <span>Tin nhắn</span>
                            </a>
                            <a href="#" onClick={() => setCurrentPage('maps')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${currentPage === 'maps' ? 'text-white bg-gray-500/20' : 'hover:bg-gray-800/50'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <span>Bản đồ</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>Hồ sơ</span>
                            </a>
                        </nav>
                        <hr className="border-gray-700/50 pt-2"/>
                        <button className="w-full logout-button font-bold py-3 rounded-lg flex items-center justify-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={`col-span-12 ${currentPage === 'maps' ? 'lg:col-span-9' : 'lg:col-span-5'} space-y-6`}>
                    {renderPage()}
                </main>
                
                {/* Right Sidebar (conditional rendering) */}
                {currentPage !== 'maps' && <RightSidebar />}
            </div>
        </>
    );
};

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
    camera.position.z = 1 + window.scrollY * 0.001;
    renderer.render(scene, camera);
};
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Main React App Component
const App = () => {
    return (
        <div className="relative z-10 container mx-auto grid grid-cols-12 gap-8 px-4 py-8">
            {/* Left Sidebar Navigation */}
            <aside className="col-span-12 lg:col-span-3 h-fit sticky top-8">
                <div className="glass-pane p-4 rounded-2xl space-y-2">
                    {/* User Profile Section */}
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
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold bg-gray-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <span>Tin nhắn</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>Bản đồ</span>
                        </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors">
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

            {/* Main Content: Messages */}
            <main className="col-span-12 lg:col-span-9">
                <div className="glass-pane rounded-2xl h-[calc(100vh-4rem)] flex chat-container">
                    
                    {/* Conversations List */}
                    <div className="w-full md:w-1/3 border-r border-gray-700/50 flex flex-col">
                        <div className="p-4 border-b border-gray-700/50">
                            <h2 className="text-xl font-bold text-white">Tin nhắn</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scroll">
                            {/* Individual Conversation Items */}
                            <div className="flex items-center gap-4 p-4 cursor-pointer bg-gray-500/20">
                                <img src="https://placehold.co/48x48/8A2BE2/FFFFFF?text=C" alt="User Avatar" className="w-12 h-12 rounded-full"/>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-white">Cosmo Explorer</h3>
                                        <p className="text-xs text-gray-400">15:32</p>
                                    </div>
                                    <p className="text-sm text-gray-300 truncate flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 6-11 11-4-4"/></svg>
                                        <span>Tuyệt vời! Hẹn gặp bạn ở đó nhé.</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
                                <img src="https://placehold.co/48x48/00BFFF/FFFFFF?text=G" alt="User Avatar" className="w-12 h-12 rounded-full"/>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-white">Galaxy Gazer</h3>
                                        <p className="text-xs text-gray-400">Hôm qua</p>
                                    </div>
                                    <p className="text-sm text-gray-400 truncate">Cảm ơn bạn đã chia sẻ thông tin.</p>
                                </div>
                            </div>
                                <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
                                <img src="https://placehold.co/48x48/FFAA00/FFFFFF?text=S" alt="User Avatar" className="w-12 h-12 rounded-full"/>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-white">Starlight</h3>
                                        <p className="text-xs text-gray-400">2 ngày</p>
                                    </div>
                                    <p className="text-sm text-gray-400 truncate">Ảnh đẹp lắm!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="w-full md:w-2/3 flex flex-col">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-700/50">
                            <div className="flex items-center gap-4">
                                <img src="https://placehold.co/40x40/8A2BE2/FFFFFF?text=C" alt="User Avatar" className="w-10 h-10 rounded-full"/>
                                <div>
                                    <h3 className="font-bold text-white">Cosmo Explorer</h3>
                                    <p className="text-xs text-green-400">Đang hoạt động</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </button>
                                <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Message Area */}
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scroll">
                            {/* Received Message */}
                            <div className="flex items-start gap-3">
                                <img src="https://placehold.co/32x32/8A2BE2/FFFFFF?text=C" alt="User Avatar" className="w-8 h-8 rounded-full"/>
                                <div className="flex flex-col items-start">
                                    <div className="bg-gray-700/50 p-3 rounded-lg rounded-tl-none max-w-xs md:max-w-md">
                                        <p>Chào Alex, bạn có kế hoạch quan sát mưa sao băng Perseid vào cuối tuần này không?</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 pl-1">Cosmo Explorer • 15:28</p>
                                </div>
                            </div>
                            
                            {/* Sent Message */}
                            <div className="flex items-end gap-3 justify-end">
                                <div className="flex flex-col items-end">
                                    <div className="bg-indigo-600 p-3 rounded-lg rounded-br-none max-w-xs md:max-w-md">
                                        <p>Chào Cosmo! Chắc chắn rồi, tôi đã chuẩn bị sẵn sàng. Chúng ta có thể gặp nhau ở đài thiên văn không?</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 pr-1">15:30</p>
                                </div>
                                    <img src="https://placehold.co/32x32/4F46E5/FFFFFF?text=A" alt="User Avatar" className="w-8 h-8 rounded-full"/>
                            </div>
                            
                            {/* Sent Message with Read Receipt */}
                            <div className="flex items-end gap-3 justify-end">
                                <div className="flex flex-col items-end">
                                    <div className="bg-indigo-600 p-3 rounded-lg rounded-br-none max-w-xs md:max-w-md">
                                        <p>Tuyệt vời! Hẹn gặp bạn ở đó nhé.</p>
                                    </div>
                                    <div className="flex items-center justify-end mt-1 pr-1">
                                        <p className="text-xs text-gray-500 mr-1">15:32</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 6-11 11-4-4"/></svg>
                                    </div>
                                </div>
                                    <img src="https://placehold.co/32x32/4F46E5/FFFFFF?text=A" alt="User Avatar" className="w-8 h-8 rounded-full"/>
                            </div>
                        </div>
                        
                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-700/50">
                            <div className="flex items-center gap-4 bg-gray-800/50 border border-gray-700/60 rounded-full p-2">
                                <input type="text" placeholder="Nhập tin nhắn..." className="flex-1 bg-transparent px-2 text-white focus:outline-none"/>
                                <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                                </button>
                                    <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                </button>
                                <button className="main-button rounded-full p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Render the React app to the DOM
ReactDOM.render(<App />, document.getElementById('root'));

// --- 3D Cosmic Background Script using Three.js ---
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
    // Assign random positions for each star
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

// Mouse movement interaction
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

const clock = new THREE.Clock();

// Animation loop
const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate stars based on mouse position
    stars.rotation.y = -mouseX * 0.00005;
    stars.rotation.x = -mouseY * 0.00005;

    // Adjust camera on scroll for a parallax effect
    camera.position.z = 1 + (document.documentElement.scrollTop || document.body.scrollTop) * 0.001;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

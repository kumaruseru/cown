// --- Mock User Data ---
const currentUser = {
    name: "Nghĩa Trọng",
    username: "@nghiatrong",
    avatar: "https://placehold.co/48x48/4F46E5/FFFFFF?text=NT",
    email: "nghiatrong.dev@cosmic.net",
    bio: "Nhà phát triển vũ trụ | Người yêu thích thiên văn học."
};

// --- Settings Components ---

// Account Settings Component
const AccountSettings = ({ user }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-xl font-bold text-white">Thông tin tài khoản</h3>
            <p className="text-gray-400 mt-1">Cập nhật thông tin cá nhân của bạn.</p>
        </div>
        <hr className="border-gray-700/50"/>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tên người dùng</label>
                <input type="text" defaultValue={user.username} className="w-full p-3 rounded-lg form-input text-white"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" defaultValue={user.email} className="w-full p-3 rounded-lg form-input text-white"/>
            </div>
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tiểu sử</label>
                <textarea rows="3" className="w-full p-3 rounded-lg form-input text-white" defaultValue={user.bio}></textarea>
            </div>
        </div>
        <div className="flex justify-end">
            <button className="main-button font-bold py-2 px-6 rounded-lg">Lưu thay đổi</button>
        </div>
    </div>
);

// Security Settings Component
const SecuritySettings = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-xl font-bold text-white">Bảo mật & Đăng nhập</h3>
            <p className="text-gray-400 mt-1">Quản lý mật khẩu và các tùy chọn bảo mật.</p>
        </div>
        <hr className="border-gray-700/50"/>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu hiện tại</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 rounded-lg form-input text-white"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu mới</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 rounded-lg form-input text-white"/>
            </div>
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Xác nhận mật khẩu mới</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 rounded-lg form-input text-white"/>
            </div>
        </div>
        <div className="flex justify-end">
            <button className="main-button font-bold py-2 px-6 rounded-lg">Cập nhật mật khẩu</button>
        </div>
    </div>
);

// --- Main App Component ---
const App = () => {
    // State to manage the active settings tab
    const [activeTab, setActiveTab] = React.useState('account');

    return (
        <div className="relative z-10 container mx-auto grid grid-cols-12 gap-8 px-4 py-8">
            {/* Left Sidebar Navigation */}
            <aside className="col-span-12 lg:col-span-3 h-fit sticky top-8">
                <div className="glass-pane p-4 rounded-2xl space-y-2">
                    <a href="#" className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
                        <img src={currentUser.avatar} alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-indigo-500"/>
                        <div>
                            <h3 className="font-bold text-lg text-white">{currentUser.name}</h3>
                            <p className="text-sm text-gray-400">{currentUser.username}</p>
                        </div>
                    </a>
                    <hr className="border-gray-700/50"/>
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

            {/* Main Content: Settings */}
            <main className="col-span-12 lg:col-span-9">
                <div className="glass-pane rounded-2xl flex flex-col md:flex-row">
                    {/* Settings Navigation */}
                    <aside className="w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r border-gray-700/50">
                        <h2 className="text-2xl font-bold text-white mb-4">Cài đặt</h2>
                        <nav className="flex flex-col space-y-2">
                            <button onClick={() => setActiveTab('account')} className={`text-left w-full px-4 py-2 rounded-lg transition-colors ${activeTab === 'account' ? 'bg-blue-500/30 text-white' : 'hover:bg-gray-800/50 text-gray-300'}`}>Tài khoản</button>
                            <button onClick={() => setActiveTab('security')} className={`text-left w-full px-4 py-2 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-blue-500/30 text-white' : 'hover:bg-gray-800/50 text-gray-300'}`}>Bảo mật & Đăng nhập</button>
                        </nav>
                    </aside>
                    {/* Settings Content */}
                    <div className="w-full md:w-3/4 p-6">
                        {activeTab === 'account' && <AccountSettings user={currentUser} />}
                        {activeTab === 'security' && <SecuritySettings />}
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

// Create stars
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

// Mouse move listener
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

const clock = new THREE.Clock();

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    
    // Animate stars based on mouse position
    stars.rotation.y = -mouseX * 0.00005;
    stars.rotation.x = -mouseY * 0.00005;

    // Parallax effect on scroll
    camera.position.z = 1 + (document.documentElement.scrollTop || document.body.scrollTop) * 0.001;
    
    renderer.render(scene, camera);
};
animate();

// Resize listener
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

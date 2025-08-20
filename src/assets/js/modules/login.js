// --- Three.js Scene Component ---
const ThreeScene = () => {
    const mountRef = React.useRef(null);

    React.useEffect(() => {
        const currentMount = mountRef.current;
        
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: currentMount, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = 10;

        // Central star and corona effect
        const starGeometry = new THREE.SphereGeometry(1.5, 64, 64);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xADD8E6, transparent: true, opacity: 0.9 });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        
        const coronaGeometry = new THREE.SphereGeometry(1.7, 64, 64);
        const coronaMaterial = new THREE.MeshBasicMaterial({ color: 0x00BFFF, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
        const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
        
        const starGroup = new THREE.Group();
        starGroup.add(star);
        starGroup.add(corona);
        scene.add(starGroup);
        
        // Starfield background
        const starfieldGeometry = new THREE.BufferGeometry();
        const starfieldCount = 8000;
        const starfieldPos = new Float32Array(starfieldCount * 3);
        for(let i = 0; i < starfieldCount * 3; i++) { starfieldPos[i] = (Math.random() - 0.5) * 100; }
        starfieldGeometry.setAttribute('position', new THREE.BufferAttribute(starfieldPos, 3));
        
        // Function to create a soft star texture
        function createStarTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const context = canvas.getContext('2d');
            const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 64, 64);
            return new THREE.CanvasTexture(canvas);
        }

        const starfieldMaterial = new THREE.PointsMaterial({
            size: 0.25,
            map: createStarTexture(),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const starfield = new THREE.Points(starfieldGeometry, starfieldMaterial);
        scene.add(starfield);

        // Nebula cloud effect
        const nebulaGeometry = new THREE.BufferGeometry();
        const nebulaCount = 200;
        const nebulaPos = new Float32Array(nebulaCount * 3);
        const nebulaColors = new Float32Array(nebulaCount * 3);
        const nebulaColor = new THREE.Color();
        for(let i = 0; i < nebulaCount; i++) {
            const i3 = i * 3;
            nebulaPos[i3] = (Math.random() - 0.5) * 50;
            nebulaPos[i3 + 1] = (Math.random() - 0.5) * 30;
            nebulaPos[i3 + 2] = (Math.random() - 0.5) * 30 - 20;
            nebulaColor.set(Math.random() > 0.5 ? 0x8A2BE2 : 0x00BFFF);
            nebulaColor.toArray(nebulaColors, i3);
        }
        nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
        nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
        
        // Function to create a soft nebula texture
        function createNebulaTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const context = canvas.getContext('2d');
            const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.2, 'rgba(255,255,255,0.7)');
            gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 128, 128);
            return new THREE.CanvasTexture(canvas);
        }

        const nebulaMaterial = new THREE.PointsMaterial({
            size: 15,
            map: createNebulaTexture(),
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 0.2,
            vertexColors: true,
            depthWrite: false,
        });
        const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
        scene.add(nebula);

        // Mouse move interaction
        let mouseX = 0, mouseY = 0;
        const onDocumentMouseMove = (event) => {
            mouseX = (event.clientX - window.innerWidth / 2) / 100;
            mouseY = (event.clientY - window.innerHeight / 2) / 100;
        };
        document.addEventListener('mousemove', onDocumentMouseMove);

        // Animation loop
        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            
            // Animate objects
            starGroup.rotation.y = elapsedTime * 0.1;
            starGroup.rotation.x = elapsedTime * 0.05;
            nebula.rotation.y = elapsedTime * 0.02;
            
            // Parallax effect for camera
            camera.position.x += (mouseX - camera.position.x) * 0.02;
            camera.position.y += (-mouseY - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', onDocumentMouseMove);
        };
    }, []);

    return <canvas ref={mountRef} id="bg-canvas" />;
};

// --- UI Components ---

// SVG Icon for the login form
const GalaxyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00BFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 12a5 5 0 1 0-5-5" /><path d="M12 12a2 2 0 1 0-2-2" /><path d="M12 22a10 10 0 0 0 10-10" />
    </svg>
);

// Main App Component
const App = () => {
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Validate form data
            if (!formData.email || !formData.password) {
                throw new Error('Vui lòng điền đầy đủ email và mật khẩu');
            }

            // Send login request with MTProto encryption
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-MTProto-Encrypted': 'true'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    rememberMe: formData.rememberMe
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            // Store session info if needed
            if (data.data && data.data.sessionId) {
                sessionStorage.setItem('sessionId', data.data.sessionId);
            }

            // Redirect to dashboard after successful login
            window.location.href = '/messages.html';

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Có lỗi xảy ra trong quá trình đăng nhập');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ThreeScene />
            <div className="w-full max-w-md p-6 sm:p-8 space-y-6 rounded-2xl shadow-2xl form-container">
                <div className="text-center space-y-2">
                    <div className="flex justify-center"><GalaxyIcon /></div>
                    <h1 className="text-3xl font-bold text-white">Chào Mừng Phi Hành Gia</h1>
                    <p className="text-gray-300">Đăng nhập để tiếp tục khám phá</p>
                </div>
                <div className="w-full">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <input 
                                type="email" 
                                placeholder="Nhập email của bạn" 
                                className="w-full p-3 rounded-lg form-input" 
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <input 
                                type="password" 
                                placeholder="Nhập mật khẩu của bạn" 
                                className="w-full p-3 rounded-lg form-input" 
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center text-gray-300">
                                    <input 
                                        type="checkbox" 
                                        className="mr-2 rounded" 
                                        checked={formData.rememberMe}
                                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                                        disabled={isLoading}
                                    />
                                    Ghi nhớ tôi
                                </label>
                                <a href="forgot-password.html" className="form-link transition">Quên mật khẩu?</a>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full p-3 rounded-lg font-bold form-button disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                            </button>
                            <p className="text-center text-gray-300 text-sm">Chưa có tài khoản? <a href="register.html" className="font-semibold form-link transition">Đăng ký miễn phí</a></p>
                        </div>
                    </form>

                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-700/50" />
                        <span className="mx-4 text-gray-400 text-sm">hoặc</span>
                        <hr className="flex-grow border-gray-700/50" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-bold text-white social-button google-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                            <span>Google</span>
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-bold text-white social-button facebook-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path></svg>
                            <span>Facebook</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// Render the React app to the DOM
ReactDOM.render(<App />, document.getElementById('root'));

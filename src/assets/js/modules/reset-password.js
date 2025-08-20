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
            starGroup.rotation.y = elapsedTime * 0.1;
            starGroup.rotation.x = elapsedTime * 0.05;
            nebula.rotation.y = elapsedTime * 0.02;
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
        
        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', onDocumentMouseMove);
        };
    }, []);
    return <canvas ref={mountRef} id="bg-canvas" />;
};

// --- UI Components ---

// SVG Icon for the form
const GalaxyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00BFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 12a5 5 0 1 0-5-5" /><path d="M12 12a2 2 0 1 0-2-2" /><path d="M12 22a10 10 0 0 0 10-10" />
    </svg>
);

// Main App Component
const App = () => {
    const [formData, setFormData] = React.useState({
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!formData.password || !formData.confirmPassword) {
                throw new Error('Vui lòng điền đầy đủ thông tin');
            }

            if (formData.password !== formData.confirmPassword) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }

            if (formData.password.length < 8) {
                throw new Error('Mật khẩu phải có ít nhất 8 ký tự');
            }

            // Get token from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (!token) {
                throw new Error('Token không hợp lệ hoặc đã hết hạn');
            }

            // Send reset password request
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-MTProto-Encrypted': 'true'
                },
                body: JSON.stringify({
                    token,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra');
            }

            setSuccess('Mật khẩu đã được đặt lại thành công! Đang chuyển hướng...');
            
            // Redirect to login after successful reset
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (error) {
            console.error('Reset password error:', error);
            setError(error.message || 'Có lỗi xảy ra trong quá trình đặt lại mật khẩu');
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
                    <h1 className="text-3xl font-bold text-white">Tạo Mật Khẩu Mới</h1>
                    <p className="text-gray-300">Bảo mật tài khoản của bạn là ưu tiên hàng đầu</p>
                </div>
                
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
                            {success}
                        </div>
                    )}
                    
                    <p className="text-center text-gray-300">Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đó.</p>
                    
                    <input 
                        type="password" 
                        placeholder="Mật khẩu mới" 
                        className="w-full p-3 rounded-lg form-input" 
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Nhập lại mật khẩu mới" 
                        className="w-full p-3 rounded-lg form-input" 
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    
                    <button 
                        type="submit" 
                        className="w-full p-3 rounded-lg font-bold form-button disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang đặt lại...' : 'Đặt Lại Mật Khẩu'}
                    </button>
                    
                    <p className="text-center text-gray-300 text-sm">
                        <a href="/login" className="font-semibold form-link transition">Quay lại Đăng nhập</a>
                    </p>
                </form>
            </div>
        </>
    );
};

// Render the React app to the DOM
ReactDOM.render(<App />, document.getElementById('root'));

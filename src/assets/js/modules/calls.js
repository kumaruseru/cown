// --- React Components for Call States ---

// Outgoing call screen
const OutgoingCall = ({ setCallState }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-white text-center p-8">
        <img src="https://placehold.co/128x128/8A2BE2/FFFFFF?text=C" alt="Cosmo's Avatar" className="w-32 h-32 rounded-full border-4 border-purple-400 pulsing-avatar mb-6"/>
        <h1 className="text-4xl font-bold">Cosmo Explorer</h1>
        <p className="text-xl text-gray-400 mt-2">Đang gọi...</p>
        <div className="absolute bottom-16">
            <button onClick={() => alert('Call Canceled')} className="call-button decline-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/></svg>
            </button>
        </div>
    </div>
);

// Incoming call screen
const IncomingCall = ({ setCallState }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-white text-center p-8">
        <img src="https://placehold.co/128x128/8A2BE2/FFFFFF?text=C" alt="Cosmo's Avatar" className="w-32 h-32 rounded-full border-4 border-purple-400 pulsing-avatar mb-6"/>
        <h1 className="text-4xl font-bold">Cosmo Explorer</h1>
        <p className="text-xl text-gray-400 mt-2">Cuộc gọi đến...</p>
        <div className="absolute bottom-16 flex gap-8">
            <button onClick={() => alert('Call Declined')} className="call-button decline-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/></svg>
            </button>
            <button onClick={() => setCallState('active')} className="call-button accept-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </button>
        </div>
    </div>
);

// Active call screen with timer and controls
const ActiveCall = ({ setCallState }) => {
    const [elapsedTime, setElapsedTime] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <div className="w-full h-full relative">
            {/* Friend's Video Feed */}
            <div 
                className="w-full h-full bg-cover bg-center" 
                style={{backgroundImage: "url('https://placehold.co/1920x1080/8A2BE2/FFFFFF?text=Cosmo%27s+Feed')"}}
            >
            </div>

            {/* Call Info Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center text-white p-3 rounded-xl glass-pane">
                <h2 className="text-xl font-bold">Cosmo Explorer</h2>
                <p className="text-md text-gray-300">{formatTime(elapsedTime)}</p>
            </div>

            {/* Your Video Feed */}
            <div className="absolute bottom-32 sm:bottom-8 right-4 w-1/3 max-w-[250px] aspect-video rounded-lg overflow-hidden glass-pane border-2 border-blue-400">
                    <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{backgroundImage: "url('https://placehold.co/640x360/4F46E5/FFFFFF?text=Your+Feed')"}}
                >
                </div>
            </div>
            
            {/* Call Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 p-4 rounded-full glass-pane">
                <button className="call-button control-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <button className="call-button control-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                </button>
                <button onClick={() => alert('Call Ended')} className="call-button decline-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/></svg>
                </button>
                    <button className="call-button control-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
                </button>
                <button className="call-button control-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 18v-6M9 15l3-3 3 3"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

// Main App Component to manage call state
const App = () => {
    const [callState, setCallState] = React.useState('active'); // Can be 'outgoing', 'incoming', or 'active'

    const renderCallScreen = () => {
        switch(callState) {
            case 'outgoing':
                return <OutgoingCall setCallState={setCallState} />;
            case 'active':
                return <ActiveCall setCallState={setCallState} />;
            case 'incoming':
            default:
                return <IncomingCall setCallState={setCallState} />;
        }
    }

    return (
        <div className="w-full h-full">
            {renderCallScreen()}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));

// --- 3D Cosmic Background Script ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 300;
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('cosmic-bg'),
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const starGeo = new THREE.BufferGeometry();
const starCount = 8000;
const posArray = new Float32Array(starCount * 3);
const velArray = new Float32Array(starCount);

for (let i = 0; i < starCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 600;
    velArray[i] = 0;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

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

const starMaterial = new THREE.PointsMaterial({
    size: 1,
    map: createStarTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});
const stars = new THREE.Points(starGeo, starMaterial);
scene.add(stars);

// Animation loop
const animate = () => {
    const positions = starGeo.attributes.position.array;
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        positions[i3 + 2] += 0.5; // Move stars towards camera
        if (positions[i3 + 2] > camera.position.z) {
            positions[i3 + 2] = -300; // Reset star position
        }
    }
    starGeo.attributes.position.needsUpdate = true;
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
